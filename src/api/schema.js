const schema = `

type Ward {
  _id: String!
  name: String
}
type Stake {
  _id: String!
  name: String
  wards: [Ward]
  wardCount: Int
}


# the schema allows the following query:
type Query {
  stakes: [Stake]
  searchStakes(
    searchString: String!
  ): [Stake] 
}

type Mutation {
  submitStake(
    stakeName: String!
    wardName: String!
  ): Stake
  
  submitWard(
    stakeId: String!
    wardName: String!
  ): Stake
}


`;

export default schema;