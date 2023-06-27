import React from 'react';
import {Text, View, StyleSheet, Page, PDFViewer, Document } from '@react-pdf/renderer';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { db } from "lib/firebase"
import { useState } from 'react';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import { useVisitors } from 'VisitorContext';
import { useFirestoreQueryData } from '@react-query-firebase/firestore';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    height: 25,
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    borderLeftWidth: 1,
    borderLeftColor: '#000',
    borderLeftStyle: 'solid',
    paddingTop: 1,
    paddingLeft: 2,
    textAlign: 'center',
  }
});

function split(array, n) {
    let [...arr]  = array;
    var res = [];
    if (arr.length !== 0) {
        while (arr.length) {
        res.push(arr.splice(0, n));
        }
        while(res[res.length - 1].length - n !== 0) {
        res[res.length - 1][res[res.length - 1 ].length] = {filler: ''}
        }
        return res;
    } else {
        res = Array.from(Array(1), () => {
            return new Array(20).fill({filler: ''})
        })
        return res
    }
  }

function VisitorPDF() {
    const {base} = useVisitors()
    const [visitors, setVisitors] = useState()
    const {state} = useLocation()
    const {startDate, endDate} = state
    console.log("#READ DATABASE")
    const ref = query(collection(db, "visitors"), where("signedOut", "!=", "null"), where("dodaac", "==", base.dodaac), where("signedOut", ">=", startDate), where("signedOut", "<=", endDate), orderBy("signedOut"))
    const data = useFirestoreQueryData(["1109"],ref,{subscribe: false})
    if (data.status === "success" && visitors === undefined) {setVisitors(split(data.data,20))}
    return (
    <>
    {visitors !== undefined ? visitors.map(visitor => {
        return (
            <PDFViewer width={window.innerWidth} height={window.innerHeight}>
                <Document>
                <Page orientation='landscape'>
                <View style={{margin: 4}}>
                    <View key={"headerRow1"} style={[styles.row, {borderTopWidth: 1, borderTopColor: '#000',borderTopStyle: 'solid'}]}>
                        <View style={[styles.cell, { width: 43 }]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8, textAlign: 'left' }}>YEAR</Text>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8, textAlign: 'left' }}>{moment(new Date()).format("YYYY")}</Text>
                        </View>
                        <View style={[styles.cell, { width: 425}]}>
                            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10 }}>VISITOR REGISTER LOG</Text>
                        </View>
                        <View style={[styles.cell, { width: 190 }]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8, textAlign: 'left'}}>ORGANIZATION</Text>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8, textAlign: 'left'}}>{base.squadron}</Text>
                        </View>
                        <View style={[styles.cell, { width: 190 }]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8, textAlign: 'left'}}>LOCATION</Text>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8, textAlign: 'left'}}>{base.base}</Text>
                        </View>
                    </View>
                    <View key={"headerRow2"} style={ { flexDirection: 'row',height: 15}}>
                        <View style={[styles.cell, {width: 43, borderBottom: 0}]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8, textAlign: 'left'}}>MONTH</Text>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8, textAlign: 'left' }}>{moment(new Date()).format("MMM")}</Text>
                        </View>
                        <View style={[styles.cell, { width: 425, borderBottomWidth: 1, borderBottomColor: '#000', borderBottomStyle: 'solid'}]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8}}>VISITOR IDENTIFICATION</Text>
                        </View>
                        <View style={[styles.cell, {width: 190, paddingTop: 15}]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8, alignItems: 'center'}}>SIGNATURE OF ESCORT</Text>
                        </View>
                        <View style={[styles.cell, {width: 90, paddingTop: 15}]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8}}>BADGE NUMBER</Text>
                        </View>
                        <View style={[styles.cell, { width: 100, borderBottomWidth: 1, borderBottomColor: '#000', borderBottomStyle: 'solid', }]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>TIME</Text>
                        </View>
                    </View>
                    <View key={"headerRow3"} style={styles.row}>
                        <View style={[styles.cell, { width: 43, flexDirection: 'column', textAlign: 'left', paddingLeft: 0 }]}>
                            <View>
                                <Text style={{ fontFamily: 'Helvetica', fontSize: 8}}>----------------</Text>
                                <Text style={{ fontFamily: 'Helvetica', fontSize: 8}}>  DAY</Text>
                            </View>
                        </View>
                        <View style={[styles.cell, { width: 190, paddingTop: 5 }]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>NAME {'\n'}(Last, First, Middle Initial)</Text>
                        </View>
                        <View style={[styles.cell, { width: 45, paddingTop: 10 }]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>GRADE</Text>
                        </View>
                        <View style={[styles.cell, { width: 190, paddingTop: 10 }]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>ORGANIZATION OR FIRM</Text>
                        </View>
                        <View style={[styles.cell, {width: 190}]}> </View>
                        <View style={[styles.cell, {width: 90}]}></View>
                        <View style={[styles.cell, {width: 50, paddingTop: 10}]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>IN</Text>
                        </View>
                        <View style={[styles.cell, {width: 50, paddingTop: 10}]}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>OUT</Text>
                        </View>
                    </View>
                    {visitor !== undefined ? visitor.map(( visit, index ) => {
                        return (
                            <View style={styles.row} key={index}>
                                <View style={[styles.cell, { width: 43, paddingTop: 10  }]}>
                                    <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>{visit.filler !== '' ? moment(new Date(visit.created.seconds * 1000)).format("DD") : null}</Text>
                                </View>
                                <View style={[styles.cell, { width: 190, paddingTop: 10 }]}>
                                    <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>{visit.filler !== '' ? visit.name : null}</Text>
                                </View>
                                <View style={[styles.cell, { width: 45, paddingTop: 10 }]}>
                                    <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>{visit.filler !== '' ? visit.rank : null}</Text>
                                </View>
                                <View style={[styles.cell, { width: 190, paddingTop: 10 }]}>
                                    <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>{visit.filler !== '' ? visit.org : null}</Text>
                                </View>
                                <View style={[styles.cell, {width: 190, paddingTop: 10 }]}>
                                    <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>{visit.filler !== '' ? visit.escort : null}</Text>
                                </View>
                                <View style={[styles.cell, {width: 90, paddingTop: 10 }]}>
                                    <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>{visit.filler !== '' ? visit.badge : null}</Text>
                                </View>
                                <View style={[styles.cell, {width: 50, paddingTop: 10}]}>
                                    <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>{visit.filler !== '' ? moment(new Date(visit.created.seconds * 1000)).format("h:mm a") : null}</Text>
                                </View>
                                <View style={[styles.cell, {width: 50, paddingTop: 10}]}>
                                    <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>{visit.filler !== '' ? moment(new Date(visit.signedOut.seconds * 1000)).format("h:mm a") : null}</Text>
                                </View>
                            </View>
                        )
                    }) : null}
                    <View key={"footerRow1"}  style={{flexDirection: 'row'}}>
                        <View style={{ width: 325, paddingLeft: 2, paddingTop: 1 }}>
                            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10, fontWeight: "bold" }}>AF IMT 1109, 19990501, V2</Text>
                        </View>
                        <View style={{ width: 190, paddingLeft: 2, paddingTop: 1 }}>
                            <Text style={{ fontFamily: 'Helvetica', fontSize: 8}}>PREVIOUS EDITIONS ARE OBSOLETE.</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
        </PDFViewer>
        )
    }) : null}
    </>
    )
    }

export default VisitorPDF;

