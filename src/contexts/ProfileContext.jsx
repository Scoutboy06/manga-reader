import { useState, useEffect, createContext } from 'react';
import fetchAPI from '../functions/fetchAPI';

export const ProfileContext = createContext();

export default function Provider(props) {
	const [profiles, setProfiles] = useState();
	const [currentProfile, setCurrentProfile] = useState();
	const [isLoading, setIsLoading] = useState(true);

	const actions = {
		selectProfile: profile => {
			setCurrentProfile(profile);
			sessionStorage.setItem('currentProfile', profile._id);
		},
		deselectProfile: () => {
			setCurrentProfile(null);
			sessionStorage.removeItem('currentProfile');
		},
	};

	useEffect(() => {
		fetchAPI('/api/users').then(profiles => {
			setProfiles(profiles);
			setCurrentProfile(
				profiles.find(
					profile => profile._id === sessionStorage.getItem('currentProfile')
				) || null
			);
			setIsLoading(false);
		});
	}, []);

	return (
		<ProfileContext.Provider
			value={[{ currentProfile, profiles, isLoading }, actions]}
		>
			{props.children}
		</ProfileContext.Provider>
	);
}
