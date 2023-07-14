const database = require('./database')
const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
    type Query {
        teams: [Team]
        equipments:[Equipment]
        softwares:[Software]
        equipment(id:String):Equipment
        peoples:[People]
    }
    type Mutation{
      insertPeople(
        id:Int
        first_name:String
        last_name:String
        sex:String
        blood_type:String
        serve_years:Int
        role:String
        team:Int
        from:String
      ):People

        deletePeople(id:Int):People

        editPeople(
          id:Int
        first_name:String
        last_name:String
        sex:String
        blood_type:String
        serve_years:Int
        role:String
        team:Int
        from:String
        ):People
    }
    type People{
      id:Int
      first_name:String
      last_name:String
      sex:String
      blood_type:String
      serve_years:Int
      role:String
      team:Int
      from:String

    }
    type Team {
        id: Int
        manager: String
        office: String
        extension_number: String
        mascot: String
        cleaning_duty: String
        project: String
    }
    type Equipment{
      id:String
      used_by:String
      count:Int 
      new_or_used:String
      softwares:[Software]
    }
    type Software{
      id:String
      used_by:String
      developed_by:String
      description:String
    }
`
const resolvers = {
  Query: {

    teams: () => database.teams,
    equipments: () => database.equipments
    .map((equipment)=>{
      equipment.softwares = database.softwares
      .filter((software)=>{
        return software.used_by === equipment.used_by
      })
      return equipment
    })
  ,
    softwares: ()=>database.softwares,
    equipment:(parent,args,context,info)=>database.equipments
    .filter((equipment)=>{
      return equipment.id === args.id
    })[0],
    peoples:()=>database.peoples
  }
  ,Mutation:{
    insertPeople:(parent,args,context,info)=>{
      database.peoples.push(args)
      return args
    },
    deletePeople:(parent,args,context,info)=>{
      const deleted = database.peoples
      .filter((people)=>{
        return people.id === args.id
      })[0]
      database.peoples = database.peoples
      .filter((people)=>{
        return people.id !== args.id
      })
     return deleted
    },
    editPeople:(parent,args,context,info)=>{
      return database.peoples
      .filter((people)=>{
        return people.id === args.id
      }).map((people)=>{
        Object.assign(people,args)
        return people
      })[0]
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })
   
server.listen().then(({ url }) => {
console.log(`Server ready at ${url}`)
})