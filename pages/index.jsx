import Head from 'next/head'
import Image from 'next/image'
import React, {useEffect, useState } from 'react'
import {NFTCard} from "./components/nftCard"
import ReactPaginate from 'react-paginate'
import axios from 'axios'

/*
  to start the app: npm run dev => it will open localhost
*/


const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  
  const nftsPerPage = 100
  const nftsVisited = pageNumber * nftsPerPage
  const api_key = "htIZsM0aFKnZtpDdX5ssuJqvFwYXb0Gm";
  const base_URL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection`;

  async function callGetNFTsForCollectionOnce(
    startToken = ""
  ) {
    const url = `${base_URL}/?contractAddress=${collection}&withMetadata=${"true"}&startToken=${startToken}`;
    const response = await axios.get(url);
    console.log("raspuns: ", response.data)
    return response.data;
    
  }

  const fetchNFTs = async() => {  
    let nfts;
    const api_key = "htIZsM0aFKnZtpDdX5ssuJqvFwYXb0Gm";
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs`;

    console.log("Fetching nfts");
    if(!collection.length) {
      var requestOptions = {
        method: 'GET'
      };
  
      const fetchURL = `${baseURL}?owner=${wallet}`;


      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("Fetching nfts for collection owned by address");
      const fetchURL = `${base_URL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } 

    if(nfts) {
      console.log("NFTs: ", nfts);
       setNFTs(nfts.ownedNfts);
    }
  }

  const fetchNFTsForCollection = async (startToken) => {
    const {nfts} = await callGetNFTsForCollectionOnce(startToken);
    console.log(nfts);
    setNFTs(nfts)
  }

  // const fetchNFTsForCollection = async () => {
  //   if(collection.length) {
  //     var requestOptions = {
  //       method: 'GET'
  //     };
  //     const api_key = "htIZsM0aFKnZtpDdX5ssuJqvFwYXb0Gm";
  //     const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
  //     const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
  //     const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

  //     if(nfts) {
  //       console.log("NFts in collection: ", nfts);
  //       setNFTs(nfts.nfts); 
  //     }
  //   } 
  // }

  const displayNFTs = NFTs && NFTs.length && NFTs
    .map(nft => {
      return (
        <NFTCard nft={nft}></NFTCard>
      )
    })
  
  const pageCount = Math.ceil(10000 / nftsPerPage)

  const changePage = async ({selected: selectedPage}) => {
    console.log("Change page:", selectedPage);
    setPageNumber(selectedPage)
    fetchNFTsForCollection(selectedPage * 100)
  }

  useEffect(() => {
    changePage({selected: 1});
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => {setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => {setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input>
        
        <label className="text-gray-600"><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if(fetchForCollection) {
              fetchNFTsForCollection(); 
            } else fetchNFTs();
          }
        }>Let's go!</button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          displayNFTs
        }
      </div>
      <ReactPaginate
        previousLabel={"<-Previous"}
        nextLabel={"Next->"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"pagination"}
        previousLinkClassName={"previousButton"}
        nextLinkClassName={"nextButton"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}>
      </ReactPaginate>
    </div>
  )
}

export default Home
