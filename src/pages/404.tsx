import Head from "next/head";
import { DetailHeader } from "~/components/DetailHeader";
import { NoContentHeading } from "~/components/NoContentHeading";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Error 404 - Page not found</title>
      </Head>

      <DetailHeader text="Error" />
      <NoContentHeading>Error 404 - Page not found</NoContentHeading>
    </>
  );
}
