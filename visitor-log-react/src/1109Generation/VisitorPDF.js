import React from 'react';
import {Text, View, StyleSheet, Page } from '@react-pdf/renderer';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { db, auth } from "lib/firebase"
import { useState } from 'react';
import { useEffect } from 'react';
import { collectionData } from 'rxfire/firestore';
import { combineLatest, switchMap } from 'rxjs';
import moment from 'moment';

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
    const [dodaac, setDodaac] = useState()
    const [visitors, setVisitors] = useState()
    const dodaacRef = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid))

    useEffect(() => {
        collectionData(dodaacRef, { idField: 'id' })
        .pipe(
          switchMap(dodaacs => {
            return combineLatest(dodaacs.map(d => {
              const ref = query(collection(db, "DODAACS"), where("dodaac", "==", d.dodaac))
              return  collectionData(ref, {idField: 'id'})
            }));
          })
        )
        .subscribe(dodaac => 
          setDodaac(dodaac[0])
        );
      },[])

      useEffect(() => {
        collectionData(dodaacRef, { idField: 'id' })
        .pipe(
          switchMap(dodaacs => {
            return combineLatest(dodaacs.map(d => {
              const ref = query(collection(db, "visitors"), where("signedOut", "!=", "null"), where("dodaac", "==", d.dodaac), orderBy("signedOut"))
              return  collectionData(ref, {idField: 'id'})
            }));
          })
        )
        .subscribe(dodaac => 
           {
            setVisitors(split(dodaac[0], 20))
        }
        )
      },[])

    return (
    <>

    {visitors !== undefined ? visitors.map(visitor => {
        return (
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
                        <Text style={{ fontFamily: 'Helvetica', fontSize: 8, textAlign: 'left'}}>{dodaac !== undefined ? dodaac[0].squadron : null}</Text>
                    </View>
                    <View style={[styles.cell, { width: 190 }]}>
                        <Text style={{ fontFamily: 'Helvetica', fontSize: 8, textAlign: 'left'}}>LOCATION</Text>
                        <Text style={{ fontFamily: 'Helvetica', fontSize: 8, textAlign: 'left'}}>{dodaac !== undefined ? dodaac[0].base : null}</Text>
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
        )
    }) : null}
    </>
    )
    }

export default VisitorPDF;

