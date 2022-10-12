import Config from '../config'
import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'

// OrbitDB instance
let orbitdb

// Databases
let programs

// Start IPFS
export const initIPFS = async () => {
    global.IPFS = IPFS.create(Config.ipfs)
    return global.IPFS
}

// Start OrbitDB
export const initOrbitDB = async (ipfs) => {
    orbitdb = await OrbitDB.createInstance(ipfs)
    return orbitdb
}

export const getAllDatabases = async () => {
    if (!programs && orbitdb) {
        // Load programs database
        programs = await orbitdb.feed('network.programs', {
            accessController: { write: [orbitdb.identity.id] },
            create: true
        })
        
        await programs.load()
    }
    console.log(programs)
    return programs
      ? programs.iterator({ limit: -1 }).collect()
      : []
  }

export const getDB = async (address) => {
    let db
    if (orbitdb) {
        db = await orbitdb.open(address)
        console.log(db)
        await db.load()
    }
    console.log(orbitdb)
    return db
}

export const addDatabase = async (address) => {
    const db = await orbitdb.open(address)
    return programs.add({
        name: db.dbname,
        type: db.type,
        address: address,
        added: Date.now()
    })
}