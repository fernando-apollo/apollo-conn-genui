import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { Checkbox } from '../ui/checkbox';

export interface Preferences {
  skipValidation: boolean;
  consolidateUnions: boolean;
  showParentInSelections: boolean;
}

export const defaultPreferences: Preferences = {
  skipValidation: true,
  consolidateUnions: true,
  showParentInSelections: false,
};

export const Preferences = () => {
  const [preferences, setPreferences, getLatestPreferences] =
    useLocalStorage<Preferences>('user-preferences', defaultPreferences);

  const handleChange = (key: keyof Preferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  // Example of re-reading local storage before performing an action
  const performActionWithLatestPreferences = () => {
    // Method 1: Using the setter function with a callback to access the latest value
    setPreferences((currentPreferences) => {
      console.log('Latest preferences from callback:', currentPreferences);

      // Perform an action based on the latest preferences
      if (currentPreferences.consolidateUnions) {
        console.log(
          'Consolidate unions is enabled, performing special action...'
        );
        // Do something special
      }

      // Return the same value to keep preferences unchanged
      return currentPreferences;
    });
  };

  // Example of using the getLatestValue function from the hook
  const performActionWithDirectRead = () => {
    // Get the latest value directly from localStorage
    const latestPreferences = getLatestPreferences();
    console.log('Latest preferences from direct read:', latestPreferences);

    // Perform an action based on the latest preferences
    if (latestPreferences.showParentInSelections) {
      console.log(
        'Show parent in selections is enabled, performing special action...'
      );
      // Do something special
    }
  };

  return (
    <Box>
      <VStack gap={2} align='stretch'>
        <Checkbox
          variant='solid'
          size='sm'
          id='skip-validation'
          checked={preferences.skipValidation}
          defaultChecked={preferences.skipValidation}
          onChange={(e) => handleChange('skipValidation', e.target.checked)}
        >
          Skip OAS validation
        </Checkbox>
        <Text fontSize='sm'>Do not validate OAS specifications.</Text>
        <Box h={6} />

        <Checkbox
          variant='solid'
          size='sm'
          id='consolidate-unions'
          checked={preferences.consolidateUnions}
          defaultChecked={preferences.consolidateUnions}
          onChange={(e) => handleChange('consolidateUnions', e.target.checked)}
        >
          Consolidate Unions
        </Checkbox>
        <Text fontSize='sm'>
          Generate OAS <code>OneOf</code> types as single GraphQL types instead
          of using <code>union</code> types.
        </Text>
        <Box h={6} />

        <Checkbox
          size='sm'
          id='show-parent-in-selections'
          checked={preferences.showParentInSelections}
          defaultChecked={preferences.showParentInSelections}
          onChange={(e) =>
            handleChange('showParentInSelections', e.target.checked)
          }
        >
          Show Parent in Selections
        </Checkbox>
        <Text fontSize='sm'>
          Add a comment in the selection for each field to show the origin of
          the field
        </Text>
        <Box h={6} />

        <Box p={4} bg='gray.50' borderRadius='md'>
          <Text fontSize='sm' color='gray.600'>
            Your preferences are saved automatically and will persist across
            sessions.
          </Text>
        </Box>

        <Button size='sm' variant='outline' onClick={resetPreferences}>
          Reset to defaults
        </Button>

        {/* Example buttons to demonstrate re-reading local storage */}
        <Button
          size='sm'
          colorScheme='blue'
          onClick={performActionWithLatestPreferences}
        >
          Perform Action with Latest Preferences (Method 1)
        </Button>

        <Button
          size='sm'
          colorScheme='green'
          onClick={performActionWithDirectRead}
        >
          Read Latest Preferences Directly (Method 2)
        </Button>
      </VStack>
    </Box>
  );
};
