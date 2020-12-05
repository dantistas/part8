import React, { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'

const LOGIN = gql`
    mutation loginUser($username: String!, $password:String! ){
        login(
            username: $username
            password: $password
        ){
            value
            user{
                username
                favoriteGenre
            }
        }
    }
`

const LoginForm = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword]= useState("")

    const [login, result ] = useMutation(LOGIN,{
        onError: (error) => {
            props.setNotification(error.graphQLErrors[0].message)
          }
    })

    useEffect(()=>{
        if ( result.data ) {
            const token = result.data.login.value
            const user = result.data.login.user
            props.setUser(user)
            props.setToken(token)
            localStorage.setItem('user-token', token)
          }
    },[result.data] )

    const submit = async (event) => {
        event.preventDefault()

        login( { variables: {username, password} } )
        setUsername("")
        setPassword("")

    }

if(!props.show){
    return null
} else {
    return(
        <div>
            <button onClick={()=>{console.log(username,password)}}>pushme</button>
            <form onSubmit={submit}>
                <div>
                    <input placeholder="username"
                            value={username}
                            onChange={({target})=>setUsername(target.value)}
                            >
                    </input>
                </div>
                <div>
                    <input placeholder="password"
                        value={password}
                        type='password'
                        onChange={({target})=>setPassword(target.value)}
                            >
                    </input>
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )

}
    

}

export default LoginForm