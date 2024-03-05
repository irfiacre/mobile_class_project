import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  VStack,
  Text,
  FormControl,
  Center,
  NativeBaseProvider,
} from "native-base";
import { primaryColor } from "@/util/helpers";

const ModalComponent = (props: any) => {
  const {
    title,
    children,
    isOpen,
    handleCloseModel,
    handleOnSave,
    noFooter,
    size,
  } = props;

  return (
    <Center>
      <Modal isOpen={isOpen} onClose={() => handleCloseModel()}>
        <Modal.Content width="90%" {...size}>
          <Modal.CloseButton />
          <Modal.Header fontSize={32}>{title}</Modal.Header>
          <Modal.Body>{children}</Modal.Body>
          {!noFooter && (
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    handleCloseModel();
                  }}
                >
                  Cancel
                </Button>

                <Button
                  onPress={() => {
                    handleOnSave();
                  }}
                  style={{ backgroundColor: primaryColor }}
                >
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          )}
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default ModalComponent;
