import { useState, useEffect, createContext } from 'react';

export const ProfileContext = createContext();

export default function Provider(props) {
	const [profiles, setProfiles] = useState();
	const [currentProfile, setCurrentProfile] = useState([]);

	const actions = {
		selectProfile: profile => {
			setCurrentProfile(profile);
			sessionStorage.setItem('currentProfile', profile._id);
		},
		deselectProfile: () => setCurrentProfile(null),
	};

	useEffect(() => {
		fetch('/api/users')
			.then(res => res.json())
			.then(profiles => {
				setProfiles(profiles);
				setCurrentProfile(
					profiles.find(
						profile => profile._id === sessionStorage.getItem('currentProfile')
					) || null
				);
			})
			.catch(console.error);
	}, []);

	return (
		<ProfileContext.Provider value={[{ currentProfile, profiles }, actions]}>
			{props.children}
		</ProfileContext.Provider>
	);
}
