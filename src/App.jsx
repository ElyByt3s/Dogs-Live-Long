import { useState, useEffect, useRef } from "react";
import {
  Container,
  Flex,
  IconButton,
  Heading,
  Button,
  Stack,
  Input,
  Text,
  Link,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SettingsIcon, AddIcon } from "@chakra-ui/icons";

function App() {
  const [birthDate, setBirthDate] = useState("");
  const [livedTime, setLivedTime] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isLargeScreen = useBreakpointValue({ base: false, lg: true });

  const intervalRef = useRef(null);

  useEffect(() => {
    const storedDate = localStorage.getItem("birthDate");
    if (storedDate) {
      setBirthDate(storedDate);
      calculateLivedTime(storedDate);
      startInterval(storedDate);
    } else {
      onOpen();
    }
  }, []);

  const startInterval = (date) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      calculateLivedTime(date);
    }, 1000);
  };

  const calculateLivedTime = (date) => {
    if (!date) return;
    const birth = new Date(date);
    const now = new Date();
    const diff = now - birth;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    setLivedTime({ days, hours, minutes, seconds });
  };

  const handleClear = (e) => {
    localStorage.removeItem("birthDate");
    setBirthDate("");
    setLivedTime(null);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("birthDate", birthDate);
    calculateLivedTime(birthDate);
    startInterval(birthDate);
    onClose();
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <>
      <Container
        p={0}
        display={"flex"}
        flexDir={"column"}
        minH={isLargeScreen ? "100vh" : "90vh"}
        maxW="container.2xl"
        bg="green.400"
        color="#262626"
      >
        <Flex p={2} justify={"end"}>
          <IconButton
            isRound={true}
            size={isLargeScreen ? "md" : "sm"}
            colorScheme={birthDate ? "whiteAlpha" : "red"}
            aria-label="SettingsIcon"
            icon={birthDate ? <SettingsIcon /> : <AddIcon />}
            onClick={onOpen}
          />
        </Flex>
        <Flex
          h={"full"}
          w={"full"}
          align={"center"}
          justify={"center"}
          flexGrow={1}
        >
          {isLargeScreen ? (
            <Heading>
              {livedTime
                ? `${livedTime.days} Days • ${livedTime.hours} Hours • ${livedTime.minutes} Minutes • ${livedTime.seconds} Seconds`
                : "Dogs Live Long"}
            </Heading>
          ) : (
            <Stack align={"center"}>
              <Heading>
                {livedTime ? `${livedTime.days} Days` : "Dogs Live Long"}
              </Heading>
              <Text as={"b"} noOfLines={1}>
                {livedTime &&
                  `${livedTime.hours} Hours • ${livedTime.minutes} Minutes • ${livedTime.seconds} Seconds`}
              </Text>
            </Stack>
          )}
        </Flex>
        <Flex p={2} justify={"center"}>
          <Text fontWeight={"semibold"}>
            By{" "}
            <Link isExternal href="https://github.com/ElyByt3s">
              ElyByt3s
            </Link>
          </Text>
        </Flex>
      </Container>

      {/* ALERT */}
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Dogs Live Long
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>
              <Stack>
                <Text>Give Us Your Birth Date To Proceed (mm/dd/yyyy)</Text>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </Stack>
            </AlertDialogBody>

            <AlertDialogFooter
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Flex>
                <Button colorScheme="red" onClick={handleClear}>
                  Clear
                </Button>
              </Flex>

              <Stack direction={"row"}>
                <Button onClick={onClose}>Cancel</Button>
                <Button colorScheme="teal" onClick={handleSubmit}>
                  Done
                </Button>
              </Stack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default App;
