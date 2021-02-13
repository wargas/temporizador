import { Button, Flex, FormControl, FormLabel, Heading, Input, Spacer, useToast } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';


const Login = () => {

    const toast = useToast();
    const { query } = useRouter();

    useEffect(() => {
        if(query.error) {
            toast({
                title: "Crendeciais inválidas",
                status: "error"
            })
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit: async (values) => {
            await signIn('credentials', {...values, callbackUrl: "/"})            
        }
    })

    return (
        <Flex alignItems="center" justifyContent="center" height="100vh">
            <Flex p={4} flexDirection="column" borderWidth={1} borderRadius="md" width="100%" maxWidth={"480px"} boxShadow="lg">
                <form onSubmit={formik.handleSubmit}>
                    <Heading>Infome suas credenciais</Heading>

                    <FormControl mt={4} id="email">
                        <FormLabel>Email</FormLabel>
                        <Input
                            value={formik.values.email} 
                            onChange={formik.handleChange}
                            name="email"
                            type="email" />
                    </FormControl>
                    <FormControl mt={3} id="senha">
                        <FormLabel>Senha</FormLabel>
                        <Input
                            value={formik.values.password} 
                            onChange={formik.handleChange}
                            name="password"
                            type="password" />
                    </FormControl>
                    <FormControl mt={4}>
                        <Flex>
                            <Button type="submit">Entrar</Button>
                            <Spacer />
                            <Button variant="link">Cadastrar-se</Button>
                        </Flex>

                    </FormControl>
                </form>
            </Flex>
        </Flex>
    )
}

export default Login;