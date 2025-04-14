import React from 'react'
import { Header, Input } from 'semantic-ui-react'

const SearchInput = () => {
  return (
    <Header floated="right">
      <Input size="mini" icon="search" name="searchTerm" placeholder="seach messages">
      </Input>
    </Header>
  )
}

export default SearchInput
