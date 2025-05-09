import { HStack, Box, Icon, Heading, IconButton, Link } from '@chakra-ui/react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { useColorMode } from '@/components/ui/color-mode.tsx';
import { FC, ReactNode } from 'react';
import { MdOutlineHelpOutline } from 'react-icons/md';

interface HeaderProps {
  actions?: ReactNode[];
}

const Header: FC<HeaderProps> = ({ actions }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack p={4} bg='heading.bg' color='heading.fg' w='100%' height='48px'>
      <Box w='48px' borderRight='1px solid' borderColor='heading.fg'>
        <Link href='https://www.apollographql.com' target='_blank'>
          <Icon asChild w={8} h={8} fill='heading.fg' p='1px'>
            <svg fill='currentcolor' viewBox='0 0 200 200'>
              <path d='M112.246 49H88.003L53 139.848h21.927l5.721-15.393h33.076l-5.989-17.024H85.961l14.164-39.091 25.199 71.508h21.928z'></path>
              <path d='M196.313 73.038a4.991 4.991 0 0 0-.256-.897c-.027-.1-.12-.285-.12-.285a4.993 4.993 0 0 0-4.538-2.914 5 5 0 0 0-5 5c0 .562.098 1.1.268 1.603l-.014.005a90.354 90.354 0 0 1 3.346 24.451c0 24.039-9.362 46.641-26.359 63.64-16.999 17-39.6 26.36-63.64 26.36-24.039 0-46.642-9.362-63.639-26.36C19.36 146.642 10 124.04 10 100.001c0-24.04 9.362-46.641 26.361-63.64 16.997-17 39.6-26.36 63.639-26.36 21.466 0 41.781 7.47 57.987 21.173a12.218 12.218 0 0 0-.848 4.474c0 6.751 5.472 12.221 12.224 12.221 6.75 0 12.223-5.47 12.223-12.221s-5.473-12.224-12.223-12.224c-1.473 0-2.884.26-4.192.737C147.666 9.107 124.9 0 100 0 44.771 0 0 44.772 0 100.001c0 55.229 44.771 100.001 100 100.001s100-44.771 100-100.001c0-9.342-1.291-18.384-3.687-26.963z'></path>
            </svg>
          </Icon>
        </Link>
      </Box>
      <Heading fontSize='heading.sm' color='heading.fg' p={0} pl={1}>
        Apollo Connector Generator
      </Heading>
      <Box flex={1} />
      <Link
        href='https://www.apollographql.com/docs/graphos/schema-design/connectors'
        colorPalette='brand'
        target='_blank'
        color='heading.fg'
      >
        <MdOutlineHelpOutline />
      </Link>
      <IconButton size='sm' onClick={toggleColorMode} colorPalette='brand'>
        {colorMode === 'light' ? <LuMoon /> : <LuSun />}
      </IconButton>
      {actions}
    </HStack>
  );
};

export default Header;
