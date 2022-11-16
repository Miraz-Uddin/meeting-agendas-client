import {
  Document,
  Font,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import moment from "moment/moment";
import { Modal } from "react-bootstrap";
import { useGetAgendasQuery } from "../../features/agenda/agendaAPI";
import { useGetUserQuery } from "../../features/user/userAPI";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Oswald",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Oswald",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
    marginBottom: 20,
  },
  subtext: {
    fontSize: 13,
    fontFamily: "Times-Roman",
    color: "#333",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 13,
    marginBottom: 0,
    textAlign: "center",
    color: "grey",
  },
  inside: {
    fontSize: 11,
    marginBottom: 10,
    textAlign: "center",
    color: "#2c2c2c",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  viewer: {
    //the pdf viewer will take up all of the width and height
    height: "100vh",
  },
  table: {
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderTop: "1px solid #EEE",
    paddingTop: 8,
    paddingBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  // So Declarative and unDRY 👌
  row1: {
    width: "30%",
  },
  row2: {
    width: "50%",
  },
  row3: {
    width: "20%",
  },
  block: {
    display: "block",
    textAlign: "center",
  },
});

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

function MeetingPDF({ meeting }) {
  const { title, startTime, endTime, facilitator, attendees, id } =
    meeting || {};
  const { data, isLoading, isError } = useGetUserQuery(facilitator);
  const {
    data: agendasData,
    isLoading: isAgendaLoading,
    isError: isAgendaError,
  } = useGetAgendasQuery(id);
  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page style={styles.body}>
          <Text style={styles.header} fixed>
            ~ Meeting Arranged By {!isLoading && !isError && data?.name} ~
          </Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>
            <Text style={styles.block}>
              Date: {moment(startTime).format("DD MMMM, YYYY")}
            </Text>
          </Text>
          <Text style={[styles.text, styles.block]}>
            Time: {moment(startTime).format("h:mm a")} -{" "}
            {moment(endTime).format("h:mm a")}
          </Text>
          <Text style={styles.text}>
            Participants:{" "}
            <Text style={styles.subtext}>
              {attendees?.map(
                (attendee, i) =>
                  attendee.name + `${i === attendees.length - 1 ? "" : ", "}`
              )}
            </Text>
          </Text>
          <View style={[styles.row, styles.bold, styles.header]}>
            <Text style={styles.row1}>Time</Text>
            <Text style={styles.row2}>Agenda Topic</Text>
            <Text style={styles.row3}>Speaker</Text>
          </View>
          {!isAgendaLoading &&
            !isAgendaError &&
            agendasData?.map((row, i) => {
              return (
                <View key={i} style={[styles.row, styles.inside]} wrap={false}>
                  <Text style={styles.row1}>
                    {moment(row.startTime).format("h:mm a")} -{" "}
                    {moment(row.endTime).format("h:mm a")}
                  </Text>
                  <Text style={styles.row2}>{row.name}</Text>
                  <Text style={styles.row3}>{row?.speaker?.name}</Text>
                </View>
              );
            })}
          {/* </Text> */}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default function PDFModal(props) {
  const { onHide, show, meeting } = props;
  return (
    <Modal onHide={onHide} show={show} size="xl">
      <MeetingPDF meeting={meeting} />
    </Modal>
  );
}
