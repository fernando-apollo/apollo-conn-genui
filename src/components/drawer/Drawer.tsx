'use client';

import {
  Button,
  CloseButton,
  Portal,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '@chakra-ui/react';
import { ReactNode, useState } from 'react';

interface DrawerProps {
  children: ReactNode;
  content?: ReactNode;
}

export const Drawer = ({ children, content }: DrawerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DrawerTrigger asChild>
        <Button variant='outline' size='sm'>
          Open Drawer
        </Button>
      </DrawerTrigger>
      {children}
      <Portal>
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>{content}</DrawerBody>
            <DrawerFooter>
              <Button variant='outline'>Cancel</Button>
              <Button>Save</Button>
            </DrawerFooter>
            <DrawerCloseTrigger asChild>
              <CloseButton size='sm' />
            </DrawerCloseTrigger>
          </DrawerContent>
        </DrawerPositioner>
      </Portal>
    </DrawerRoot>
  );
};
