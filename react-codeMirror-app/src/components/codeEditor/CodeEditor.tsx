import { useState } from 'react';
import {
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Separator,
  Text,
  VStack,
} from '@chakra-ui/react';

import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../ui/menu';

import { githubLight } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';

import { LanguageSupport } from '@codemirror/language';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';

const BASE = import.meta.env.VITE_API_URL;

console.log(BASE);

const EXTENSIONS: { [key: string]: LanguageSupport[] } = {
  python: [python()],
  javascript: [javascript()],
};

function CodeEditor() {
  const initialResult = {
    message: '',
    output: '',
    error: '',
  };

  const [post, setPost] = useState<Post>({
    language: 'python',
    code: "print('Hello world!')",
  });
  const [result, setResult] = useState<Result>(initialResult);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (post.code === '') {
      setResult({ ...initialResult, error: 'You have to code something' });
      return;
    }
    try {
      const res = await fetch(`${BASE}/execute`, {
        method: 'POST',
        body: JSON.stringify({
          code: post.code,
          language: post.language,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      console.log(res);
      const data = await res.json();

      setResult(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Center h={'100vh'} background={'gray.50'}>
      <VStack
        boxShadow={'sm'}
        p={4}
        borderStyle={'solid'}
        borderWidth={1}
        rounded={'lg'}
        backgroundColor={'lightblue'}
        w={'100%'}
        lg={{ w: '1024px' }}
      >
        {/* Title and Select part*/}
        <HStack
          w={'100%'}
          justify={'space-between'}
          flexDirection={'column'}
          sm={{ flexDirection: 'row' }}
        >
          <Heading>Code Editor</Heading>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="subtle"
                size="sm"
                width={'128px'}
                outline={'none'}
              >
                {post.language}
              </Button>
            </MenuTrigger>
            <MenuContent>
              {Object.entries(EXTENSIONS).map(([language, _]) => (
                <MenuItem
                  key={language}
                  value={language}
                  onClick={() => setPost({ ...post, language: language })}
                >
                  {language}
                </MenuItem>
              ))}
            </MenuContent>
          </MenuRoot>
        </HStack>

        <Separator />

        {/* Text block part*/}
        <HStack w={'100%'} justify={'start'}>
          <Flex w={'100%'} backgroundColor={'white'} padding={'5px'}>
            <Text wordBreak={'break-word'} textAlign={'left'}>
              Write any code in the selected language for test (Python or
              Javascript).
            </Text>
          </Flex>
        </HStack>

        <form onSubmit={handleSubmit}>
          {/* CodeMirror Editor part */}
          <CodeMirror
            value={post.code}
            onChange={(newValue) => setPost({ ...post, code: newValue })}
            theme={githubLight}
            extensions={EXTENSIONS[post.language]}
            basicSetup={{ autocompletion: true }}
            minHeight={'300px'}
            style={{ textAlign: 'left' }}
          />

          {/* Run button part */}
          <HStack w={'100%'} justify={'start'}>
            <Button
              type="submit"
              colorPalette="teal"
              size="sm"
              width={'130px'}
              _hover={{ backgroundColor: 'teal.700' }}
            >
              Run
            </Button>
          </HStack>
        </form>

        {/* Show Result part */}
        <HStack w={'100%'} justify={'start'}>
          <Flex
            w={'100%'}
            backgroundColor={'white'}
            h={'100px'}
            direction={'column'}
            padding={'5px'}
            overflow={'auto'}
          >
            <Text
              wordBreak={'break-word'}
              textAlign={'left'}
              color={'green.600'}
            >
              {result.message}
            </Text>
            {result.output && (
              <Text wordBreak={'break-word'} textAlign={'left'}>
                Code output: {result.output}
              </Text>
            )}
            <Text wordBreak={'break-word'} textAlign={'left'} color={'red.600'}>
              {result.error}
            </Text>
          </Flex>
        </HStack>
      </VStack>
    </Center>
  );
}

export default CodeEditor;
