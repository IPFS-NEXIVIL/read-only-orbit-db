import { addDatabase, getDB, initOrbitDB, initIPFS, getAllDatabases } from "./database";
import { useState, useEffect } from "react";


function App() {

  const [alldb, setalldb] = useState([]);
  const [selectedDB, setSelectedDB] = useState(null);
  const [addRemoteDB, setAddRemoteDB] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    initIPFS().then(async (ipfs) => {
      initOrbitDB(ipfs).then(async (databases) => {
        const programs = await getAllDatabases();
        setalldb(programs);
        console.log(alldb, "all dbs");
      });
    });
  }, [alldb]);

  const getData = async () => {
    // const queryData = selectedDB
    //   .query((e) => e !== null, { fullOp: true })
    //   .reverse();
    await selectedDB.load(5)
    selectedDB.events.on('peer', (peer) => console.log(peer))
    console.log(selectedDB.address)
    const queryData = selectedDB
      .query((e) => e !== null, { fullOp: true })
      .reverse();
    console.log("queryData", queryData)
    const value = selectedDB.get('');
    // console.log(queryData, "kkkkkkkkkkk");
    console.log("value", value)
    setData(queryData);
    console.log(data)
  };

  // add RemoteDB section
  function AddDB(props) {

    return (
      <article>
        <h2>Add Remote OrbitDB 💖</h2>
        <i>Open a database from an OrbitDB address, eg. /orbitdb/QmfY3udPcWUD5NREjrUV351Cia7q4DXNcfyRLJzUPL3wPD/hello </i>
        <form onSubmit={event=>{
          event.preventDefault();
          const address = event.target.address.value;
          props.onAdd(address);
        }}>
          <p><input type="text" name="address" placeholder="orbit db address" size="75"/></p>
          <p><input type="submit" value="Add"></input></p>
        </form>
      </article>
    )
  }

  const onAdd = async(address) => {
    setAddRemoteDB(address);
    console.log(addRemoteDB, "에 연결 중 ...")
    addDatabase(address).then(async (hash) => {
    console.log("Added", address);
    const db = await getDB(address);
    setSelectedDB(db);
    });
  }
  
  return (
    <div className="App">
      <AddDB onAdd={(address)=>{
        onAdd(address)
      }}></AddDB>
      <p>🚀 Connect to {addRemoteDB}</p>
      {/* <ConnectDB></ConnectDB> */}
      <button onClick={getData}>Query get Data</button>
      <ul>
          {data.map((data) => {
            return (
              <>
                <li>{JSON.stringify(data.payload.value, null, 2)}</li>
                <br />
              </>
            );
          })}
        </ul>
    </div>
  );
}

export default App;
