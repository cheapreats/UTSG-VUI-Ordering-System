import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div>
      <Link href="/test">Hello</Link>
    </div>
  );
};

export default Home;
