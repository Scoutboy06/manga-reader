import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export type DropdownPlacement = 'bl' | 'br' | 'tl' | 'tr';

export type DropdownContextValue = [
	{ isOpen?: boolean; placement?: DropdownPlacement },
	{ setIsOpen?: Dispatch<SetStateAction<boolean>> }
];

const DropdownContext = createContext<DropdownContextValue>([{}, {}]);

export const useDropdownContext = () => useContext(DropdownContext);

export default DropdownContext;
