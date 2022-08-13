import { useState, useEffect, createContext } from 'react';
import useSWR from 'swr';

export const ProfileContext = createContext();

export default function Provider(props) {
	const { data: profiles, error } = useSWR('/users');
	const [isLoading, setIsLoading] = useState(true);
	const [currentProfile, setCurrentProfile] = useState();

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
		if (profiles && !error) {
			setCurrentProfile(
				profiles.find(
					profile => profile._id === sessionStorage.getItem('currentProfile')
				) || null
			);
			setIsLoading(false);
		}
	}, [profiles, error]);

	return (
		<ProfileContext.Provider
			value={[{ currentProfile, profiles, isLoading, error }, actions]}
		>
			{props.children}
		</ProfileContext.Provider>
	);
}
