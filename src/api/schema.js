const schema = `

type SeatPosition {
  bench: String
  position: Int
  top: Int
  left: Int
}
type DeaconRoute {
  bench: String
  direction: String
  top: Int
  left: Int
}

type BishopPosition {
  top: Int
  left: Int
}

input SeatPositionInput {
  bench: String
  position: Int
  top: Int
  left: Int
}
input DeaconRouteInput {
  bench: String
  direction: String
  top: Int
  left: Int
}

input BishopPositionInput {
  top: Int
  left: Int
}

type Deacon {
  _id: String!
  route: Int
  color: String
  passToBishop: Boolean
  seat: SeatPosition
  route: DeaconRoute
  bishop: BishopPosition
}

input DeaconInput {
  _id: String!
  route: Int
  color: String
  passToBishop: Boolean
  seat: SeatPositionInput
  route: DeaconRouteInput
  bishop: BishopPositionInput
}

type Route {
  _id: String!
  chapel: [Int]
  deacons: [Deacon]
  deaconCount: Int
}

type Ward {
  _id: String!
  name: String
  routes: [Route]
  routeCount: Int
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
  
  getStake(
      stakeId: String!
  ): Stake
  
  getWard(
      stakeId: String!
      wardId: String!
  ): Ward
  
  getRoute(
      stakeId: String!
      wardId: String!
      routeId: String!
  ): Route
 
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
  
  submitRoute(
    stakeId: String!
    wardId: String!
    chapel: [Int]
    deacons: [DeaconInput]
  ): Route
}

`;

export default schema;