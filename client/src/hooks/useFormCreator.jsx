import { useState } from 'react';

export default function useFormCreator(fields) {
	const [states, setStates] = useState(
		fields?.reduce(
			(previousValue, currentField) => ({
				...previousValue,
				[currentField.name]: currentField.defaultValue,
			}),
			{}
		)
	);

	const updateFields = () => {
		stateChange(
			fields?.reduce(
				(previousValue, currentField) => ({
					...previousValue,
					[currentField.name]: currentField.defaultValue,
				}),
				{}
			)
		);
	};

	const isDisabled = field => {
		if (typeof field.disabled === 'boolean') return field.disabled;
		if (typeof field.disabled === 'function') return field.disabled(states);
		return field.disabled;
	};

	const inputChange = (i, value) => {
		stateChange({
			...states,
			[fields[i].name]: value,
		});
	};

	const selectChange = (i, value) => {
		stateChange({
			...states,
			[fields[i].name]: value,
		});
	};

	const checkboxClick = i => {
		stateChange({
			...states,
			[fields[i].name]: !states[fields[i].name],
		});
	};

	const stateChange = states => {
		if (!states) return setStates({});

		for (const field of fields) {
			if (field?.forceValue === undefined) continue;

			const currentState = states[field.name];
			let newState = field.forceValue(states);
			if (newState !== currentState && newState !== null) {
				states[field.name] = newState;
			}
		}

		setStates(states);
	};

	return [
		states,
		fields
			? fields.map((field, i) => (
					<div className='formGroup' key={field.name}>
						{field.label && <label htmlFor={field.name}>{field.label}</label>}

						{field.type === 'input' && (
							<input
								type='text'
								id={field.name}
								value={states[field.name]}
								onChange={e => inputChange(i, e.target.value)}
								disabled={isDisabled(field)}
								autoComplete={field?.autoComplete ? 'on' : 'off'}
							/>
						)}

						{field.type === 'input:number' && (
							<input
								type='number'
								id={field.name}
								value={states[field.name]}
								onChange={e => inputChange(i, e.target.value)}
								disabled={isDisabled(field)}
								min={field.min || null}
								max={field.max || null}
							/>
						)}

						{field.type === 'textarea' && (
							<textarea
								id={field.name}
								value={states[field.name]}
								disabled={isDisabled(field)}
								onChange={e => inputChange(i, e.target.value)}
							/>
						)}

						{field.type === 'select' && (
							<select
								id={field.name}
								defaultValue={field.defaultValue}
								onChange={e => selectChange(i, e.target.value)}
								disabled={isDisabled(field)}
							>
								{field?.options?.map(option => (
									<option value={option.value} key={option.value}>
										{option.displayName}
									</option>
								))}
							</select>
						)}

						{field.type === 'checkbox' && (
							<button
								id={field.name}
								type='button'
								className='checkbox'
								disabled={isDisabled(field)}
								data-ischecked={states[field.name]}
								onClick={() => checkboxClick(i)}
							></button>
						)}

						{!field.type && field}
					</div>
			  ))
			: null,
		updateFields,
	];
}
