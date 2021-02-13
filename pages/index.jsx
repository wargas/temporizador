import { Box, Flex, Heading, HStack, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Show, SimpleGrid, Stat, StatHelpText, StatLabel, StatNumber, Tab, Table, TabList, Tabs, Td, Text, Th, toast, Tr, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdTimer, MdPlayArrow, MdCheck, MdPause } from 'react-icons/md';

import { DateTime, Duration } from 'luxon';
import axios from "axios";

export default function Home() {

  const [open, setOpen] = useState(false);
  const [secounds, setSeconds] = useState(0);
  const [_id, setId] = useState(null);
  const [play, setPlay] = useState(false);
  const [registros, setRegistros] = useState([])

  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast()

  useEffect(() => {
    loadRegistros();
  }, [])

  useEffect(() => {
    let interval = null;

    if (play) {
      interval = setInterval(() => {

        setSeconds(old => old + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)

  }, [play])

  useEffect(() => {
    if (secounds % 10 === 0) {
      handlerSave()
    }
  }, [secounds])

  useEffect(() => {
    setId(null);
    setSeconds(0);
    setPlay(false)
  }, [open])

  const handlerSave = async () => {
    setLoadingSave(true)
    try {
      if (_id) {
        const { data } = await axios.put("/api/registros", { tempo: secounds, _id });

      } else {

        const { data } = await axios.post("/api/registros", { tempo: secounds });
        setId(data._id)

      }

      loadRegistros();
    } catch (error) {
      console.log(error)
      toast({
        title: "Ocorreu um erro",
        status: "error"
      })
    }
    setLoadingSave(false)
  }

  const loadRegistros = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get("/api/registros");

      setRegistros(data)
    } catch (error) {
      toast({
        title: "Ocorreu um erro",
        status: "error"
      })
    }

    setLoading(false)
  }


  return (
    <Flex p={4} width="100%" flexDirection="column" >

      <SimpleGrid columns={4} spacing={2}>
        {registros.map(registro => (
          <Flex flexDirection="column" borderWidth={1} borderRadius="lg" p={3} boxShadow="lg" key={registro._id}>
            <Text color="gray.500">{DateTime.fromFormat(registro._id, "yy-MM-dd").toFormat("D")}</Text>
            <Heading>{Duration.fromObject({ seconds: registro.total }).toFormat("hh:mm:ss")}</Heading>
          </Flex>
        ))}
      </SimpleGrid>

      <IconButton onClick={() => setOpen(true)} boxShadow="lg" bgColor="indigo" borderRadius="50%" position="absolute" bottom={4} right={8} icon={<MdTimer />} />

      <Modal isCentered isOpen={open} onClose={() => setOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tempo Estudado</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <Heading>{Duration.fromObject({ second: secounds }).toFormat("hh:mm:ss")}</Heading>
              <Flex mt={4}>
                <IconButton onClick={() => setPlay(old => !old)} icon={play ? <MdPause /> : <MdPlayArrow />} />
                <IconButton onClick={() => handlerSave()} isLoading={loadingSave} icon={<MdCheck />} ml={4} />
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

    </Flex>
  )
}
