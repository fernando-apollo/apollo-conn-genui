import { Box, Text, Link } from '@chakra-ui/react';
import { Component } from 'react';

export class Footer extends Component {
  render() {
    return (
      <Box className='footer' fontFamily='p'>
        <Text textStyle='xs'>
          Built with ❤️ by the Solution Engineering Team @ Apollo &nbsp; (
          <Link
            target='_blank'
            href='https://www.apollographql.com/docs/graphos/reference/feature-launch-stages#experimental'
          >
            experimental
          </Link>
          )
        </Text>
      </Box>
    );
  }
}
