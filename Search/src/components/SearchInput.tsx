import {
  Button,
  Card,
  CardBody,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
  Switch,
  Text,
  useColorMode,
} from "@chakra-ui/react";

import { useState } from "react";
import "./main.css";
import { Search2Icon } from "@chakra-ui/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import placeHolder from "./img/place.png";

interface movies {
  Search: [
    {
      Poster: string;
      Title: string;
      Year: string;
      Type: string;
    }
  ];
}

const SearchInput = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const { data, isLoading, error } = useQuery<movies, Error>({
    queryKey: ["movies"],
    queryFn: () =>
      axios
        .get<movies>(
          `https://www.omdbapi.com/?apikey=2279d912&s=${
            inputValue ? inputValue : "name"
          }&type="movie"&page=2`
        )
        .then((res) => res.data),
         retry: 5,
        onSuccess(data) {
      return () => data;
    },
    refetchInterval: 100,
  });

  if (isLoading)
    return (
      <Spinner
        margin={"auto"}
        position={"relative"}
        left={"50%"}
        top={"50px"}
      />
    );
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <Switch className=" color" colorScheme="green" onChange={toggleColorMode}>
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Switch>

      <form action="" onChange={(e) => e.preventDefault()}>
        <div className="filed">
          <InputGroup width={"80%"}>
            <InputLeftElement pointerEvents="none">
              <Search2Icon color="gray.300" />
            </InputLeftElement>
            <Input
              type="tel"
              placeholder="Phone number"
              id="input"
              onChange={(e) => setValue(e.currentTarget.value)}
            />
          </InputGroup>

          <Button
            onClick={() => setInputValue(value)}
            colorScheme="blue"
            type="submit"
          >
            Search
          </Button>
        </div>

        <div className="parent">
          {data?.Search.map((res) => (
            <Card key={res.Title} maxW="sm">
              <CardBody>
                <Image src={res.Poster} alt={placeHolder} borderRadius="lg" />
                <Stack mt="6" spacing="3">
                  <Heading size="md">{res.Title}</Heading>

                  <Text color="blue.600" fontSize="2xl" padding={'10px'}>
                    {res.Year}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
