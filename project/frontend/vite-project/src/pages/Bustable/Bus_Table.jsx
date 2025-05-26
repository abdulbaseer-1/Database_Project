import bus_table_style from './Bus_Table.module.css';
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Content from "../../components/content/Content";
import Footer from "../../components/Footer/Footer";
import Bus_Table from "../../components/Tables/Bus_Table/Bus_Table";

function Bus_Table_Page() {
  return (
    <div className={bus_table_style.page_wrapper}>
      <Header />
      <Hero />

      <main className={bus_table_style.content_section}>
        <Content className={bus_table_style.content_body}>
          <h1 className={bus_table_style.page_title}>Find Your Bus</h1>
          <p className={bus_table_style.page_subtitle}>
            Browse available buses by location, time, and type.
          </p>
          <Bus_Table className={bus_table_style.table_wrapper} />
        </Content>
      </main>

      <Footer />
    </div>
  );
}

export default Bus_Table_Page;
