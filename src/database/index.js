// import Config from '../config'
import { webTransport } from "@libp2p/webtransport";
import { Noise } from "@chainsafe/libp2p-noise";
import { createLibp2p } from "libp2p";
import OrbitDB from "orbit-db";
import * as IPFS from "ipfs-core";

// interface IProps {
//     ipfs: any;
// }

// OrbitDB instance
let orbitdb;

// Databases
let programs;

const libp2pBundle = () => {
  return createLibp2p({
    transports: [webTransport()],
    connectionEncryption: [() => new Noise()],
  });
};

// Start IPFS
export const initIPFS = async () => {
  global.IPFS = await IPFS.create({
    libp2p: libp2pBundle,
  });

  console.log(global.IPFS);

  return global.IPFS;
};

// Start OrbitDB
export const initOrbitDB = async (ipfs) => {
  orbitdb = await OrbitDB.createInstance(ipfs);
  console.log(orbitdb);
  return orbitdb;
};

export const getAllDatabases = async () => {
  if (!programs && orbitdb) {
    // Load programs database
    programs = await orbitdb.feed("network.programs", {
      accessController: { write: [orbitdb.identity.id] },
      create: true,
    });

    await programs.load();
  }
  console.log(programs);
  return programs ? programs.iterator({ limit: -1 }).collect() : [];
};

export const getDB = async (address) => {
  let db;
  if (orbitdb) {
    db = await orbitdb.open(address, { sync: true });
    console.log(db);

    await db.load();
  }
  console.log(orbitdb);
  return db;
};

export const addDatabase = async (address) => {
  const db = await orbitdb.open(address);
  return programs.add({
    name: db.dbname,
    type: db.type,
    address: address,
    added: Date.now(),
  });
};
