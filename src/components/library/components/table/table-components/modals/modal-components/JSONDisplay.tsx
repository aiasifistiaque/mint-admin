import React from 'react';
import { Column } from '../../../../..';
import { Heading, Text } from '@chakra-ui/react';

// Recursive function to convert JSON to nested JSX components
const renderJsonToElements = (data: any, keyPrefix: any = '') => {
	return Object?.entries(data)?.map(([key, value], index) => {
		// Create a unique key for each element
		const uniqueKey = keyPrefix ? `${keyPrefix}-${key}-${index}` : `${key}-${index}`;

		// Check if the value is an object (and not null)
		if (value && typeof value === 'object') {
			// If the value is an array, map each item
			if (Array.isArray(value)) {
				return (
					<Column
						gap={2}
						key={uniqueKey}>
						<Heading size='xs'>{key}</Heading>
						{value.map((item, idx) =>
							// If array item is an object, recurse further, otherwise render the primitive value
							typeof item === 'object' && item !== null ? (
								renderJsonToElements(item, `${uniqueKey}-${idx}`)
							) : (
								<Text
									key={`${uniqueKey}-${idx}`}
									fontSize='.8rem'
									wordBreak='break-all'>
									{item.toString()}
								</Text>
							)
						)}
					</Column>
				);
			} else {
				// If value is a plain object, recurse into it
				return (
					<Column
						p={2}
						borderWidth={1}
						borderColor='#eee'
						borderRadius={4}
						gap={2}
						key={uniqueKey}>
						<Heading size='xs'>{key}</Heading>
						{renderJsonToElements(value, uniqueKey)}
					</Column>
				);
			}
		} else {
			// For primitive values, directly render them in a <Text> component
			return (
				<Column
					gap={2}
					key={uniqueKey}>
					<Heading size='xs'>{key}</Heading>
					<Text
						fontSize='.8rem'
						wordBreak='break-all'>
						{value?.toString()}
					</Text>
				</Column>
			);
		}
	});
};

// A component that takes a JSON object as a prop and renders it
const JsonDisplay = ({ jsonData = {} }: any) => {
	return <>{renderJsonToElements(jsonData)}</>;
};

export default JsonDisplay;
