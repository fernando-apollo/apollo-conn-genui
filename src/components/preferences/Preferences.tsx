import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Box,
  Button,
  CheckboxCheckedChangeDetails,
  Text,
  VStack,
} from '@chakra-ui/react';
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
  const [preferences, setPreferences] = useLocalStorage<Preferences>(
    'user-preferences',
    defaultPreferences
  );

  const handleChange = (key: keyof Preferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
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
          onCheckedChange={(e: CheckboxCheckedChangeDetails) => {
            handleChange('skipValidation', e.checked);
          }}
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
          onCheckedChange={(e: CheckboxCheckedChangeDetails) => {
            handleChange('consolidateUnions', e.checked);
          }}
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
          onCheckedChange={(e: CheckboxCheckedChangeDetails) => {
            handleChange('showParentInSelections', e.checked);
          }}
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
      </VStack>
    </Box>
  );
};
