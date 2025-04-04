import { Progress, ProgressCircle } from '@chakra-ui/react';

export const WaitCircle = () => {
  return (
    <ProgressCircle.Root value={null} size='xs'>
      <ProgressCircle.Circle css={{ '--thickness': '2px' }}>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
};

export const WaitLine = () => {
  return (
    <Progress.Root maxW='240px' value={null} striped>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  );
};
