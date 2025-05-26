import bus_table_style from './Bus_Table.module.css';
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Content from "../../components/content/Content";
import Footer from "../../components/Footer/Footer";
import Bus_Table from "../../components/Tables/Bus_Table/Bus_Table";

function Bus_Table_Page() {
  return (
    <>
      <Header />
      <Hero />
      <Content className={bus_table_style.contentBody}>
        <Bus_Table />
      </Content>
      <Footer />
    </>
  );
}

export default Bus_Table_Page;
