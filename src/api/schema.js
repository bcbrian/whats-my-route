const schema = `

type SeatPosition {
  top: Int
  left: Int
}
type CurrentPosition {
  top: Int
  left: Int
}
type DeaconRoute {
  x: Int
  y: Int
}

input SeatPositionInput {
  top: Int
  left: Int
}

input CurrentPositionInput {
  top: Int
  left: Int
}

input DeaconRouteInput {
  x: Int
  y: Int
}

type Deacon {
  _id: String!
  color: String
  seat: SeatPosition
  current: CurrentPosition
  route: [[DeaconRoute]]
}

input DeaconInput {
  _id: String!
  color: String
  seat: SeatPositionInput
  current: CurrentPositionInput
  route: [[DeaconRouteInput]]
}

input ChapelInput {
  version: Int
  benches: [Int]
  height: Int
}

type Chapel {
  version: Int
  benches: [Int]
  height: Int
}

type Route {
  _id: String!
  chapel: Chapel
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
    chapel: ChapelInput
    deacons: [DeaconInput]
  ): Route
}

`;

export default schema;
