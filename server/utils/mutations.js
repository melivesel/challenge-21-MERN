import { gql } from '@apollo/client';


export const ADD_USER = gql`
`

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

export const SAVE_BOOK = gql`

`

export const REMOVE_BOOK= gql`
  mutation removeSkill($skill: String!) {
    removeSkill(skill: $skill) {
      _id
      name
      skills
    }
  }
`;
