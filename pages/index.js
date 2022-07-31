import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";
import Layout from "../components/layout/Layout";
import { Fragment } from "react";

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>Meetups</title>
        <meta
          name="description"
          content="Browse huge selection of meetups in your specialized fields all over the world!"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   //fetch data from api

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  //fetch data from api
  const client = await MongoClient.connect(process.env.DB_URL);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
