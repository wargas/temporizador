import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
    pages: {
        signIn: "/auth/login"
    },
    providers: [
        Providers.Credentials({
            name: "Credentials",
            credentials: {
                username: {label: "Email", type: "text", placeholder: "jose@example.com"},
                passoword: {label: "Senha", type: "password"}
            },
            async authorize(crendentials) {

                if(crendentials.email === "") {
                    return null;
                }

                return {name: "wargas", email: "teixeira.wargas@gmail.com", id: "1"}
            },
        })
    ],
    
})