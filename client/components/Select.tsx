import Dropdown, { DropdownProps } from '@/components/Dropdown';
import { MenuProps } from './Dropdown/Menu';

interface SelectProps extends DropdownProps {}

function Select({ children, ...props }: SelectProps) {
	return <Dropdown {...props}>{children}</Dropdown>;
}

interface OptionsProps extends Omit<MenuProps, 'onChange'> {
	value: string;
	options: {
		value: string;
		label: string;
	}[];
	onChange?: (value: string) => any;
}

function Options({ value, options, onChange, ...props }: OptionsProps) {
	return (
		<Dropdown.Menu {...props}>
			{options.map((option, i) => {
				if (typeof option === 'string' && option === 'divider')
					return <Dropdown.Divider key={`divider_${i}`} />;

				return (
					<Dropdown.Item
						key={option.value}
						onClick={() => onChange?.(option.value)}
						className={value === option.value ? 'selected' : ''}
					>
						{option.label}
					</Dropdown.Item>
				);
			})}
		</Dropdown.Menu>
	);
}

export default Object.assign(Select, {
	Toggle: Dropdown.Toggle,
	Options,
});
