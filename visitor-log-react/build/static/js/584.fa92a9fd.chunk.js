(self.webpackChunkvisitor_log=self.webpackChunkvisitor_log||[]).push([[584],{785:function(e,l,t){"use strict";t.r(l);var i=t(9439),n=t(4506),d=t(2791),o=t(6228),r=t(2481),s=t(2998),c=t(2426),a=t.n(c),h=t(7689),f=t(225),x=t(184),y=o.mM.create({row:{flexDirection:"row",borderBottomWidth:1,borderBottomColor:"#000",borderBottomStyle:"solid",height:25},cell:{borderRightWidth:1,borderRightColor:"#000",borderRightStyle:"solid",borderLeftWidth:1,borderLeftColor:"#000",borderLeftStyle:"solid",paddingTop:1,paddingLeft:2,textAlign:"center"}});l.default=function(){var e=(0,f.j)().base,l=(0,d.useState)(void 0),t=(0,i.Z)(l,2),c=t[0],v=t[1],j=(0,h.TH)().state,g=j.startDate,m=j.endDate,p=(0,r.IO)((0,r.hJ)(s.db,"visitors"),(0,r.ar)("signedOut","!=","null"),(0,r.ar)("dodaac","==",e.dodaac),(0,r.ar)("signedOut",">=",g),(0,r.ar)("signedOut","<=",m),(0,r.Xo)("signedOut"));return void 0===c&&((0,r.PL)(p).then((function(e){return v(function(e,l){var t=(0,n.Z)(e).slice(0),i=[];if(0!==t.length){for(;t.length;)i.push(t.splice(0,l));for(;i[i.length-1].length-l!==0;)i[i.length-1][i[i.length-1].length]={filler:""};return i}return Array.from(Array(1),(function(){return new Array(20).fill({filler:""})}))}(e.docs.map((function(e){return e.data()})),20))})),console.log("#READ DATABASE")),console.log(c),(0,x.jsx)(x.Fragment,{children:(0,x.jsx)(o.Z$,{width:window.innerWidth,height:window.innerHeight,children:(0,x.jsx)(o.BB,{children:void 0!==c?c.map((function(l){return(0,x.jsx)(o.T3,{orientation:"landscape",children:(0,x.jsxs)(o.G7,{style:{margin:4},children:[(0,x.jsxs)(o.G7,{style:[y.row,{borderTopWidth:1,borderTopColor:"#000",borderTopStyle:"solid"}],children:[(0,x.jsxs)(o.G7,{style:[y.cell,{width:43}],children:[(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8,textAlign:"left"},children:"YEAR"}),(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8,textAlign:"left"},children:a()(new Date).format("YYYY")})]}),(0,x.jsx)(o.G7,{style:[y.cell,{width:425}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica-Bold",fontSize:10},children:"VISITOR REGISTER LOG"})}),(0,x.jsxs)(o.G7,{style:[y.cell,{width:190}],children:[(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8,textAlign:"left"},children:"ORGANIZATION"}),(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8,textAlign:"left"},children:e.squadron})]}),(0,x.jsxs)(o.G7,{style:[y.cell,{width:190}],children:[(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8,textAlign:"left"},children:"LOCATION"}),(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8,textAlign:"left"},children:e.base})]})]},"headerRow1"),(0,x.jsxs)(o.G7,{style:{flexDirection:"row",height:15},children:[(0,x.jsxs)(o.G7,{style:[y.cell,{width:43,borderBottom:0}],children:[(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8,textAlign:"left"},children:"MONTH"}),(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8,textAlign:"left"},children:a()(new Date).format("MMM")})]}),(0,x.jsx)(o.G7,{style:[y.cell,{width:425,borderBottomWidth:1,borderBottomColor:"#000",borderBottomStyle:"solid"}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:"VISITOR IDENTIFICATION"})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:190,paddingTop:15}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8,alignItems:"center"},children:"SIGNATURE OF ESCORT"})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:90,paddingTop:15}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:"BADGE NUMBER"})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:100,borderBottomWidth:1,borderBottomColor:"#000",borderBottomStyle:"solid"}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:"TIME"})})]},"headerRow2"),(0,x.jsxs)(o.G7,{style:y.row,children:[(0,x.jsx)(o.G7,{style:[y.cell,{width:43,flexDirection:"column",textAlign:"left",paddingLeft:0}],children:(0,x.jsxs)(o.G7,{children:[(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:"----------------"}),(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:"  DAY"})]})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:190,paddingTop:5}],children:(0,x.jsxs)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:["NAME ","\n","(Last, First, Middle Initial)"]})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:45,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:"GRADE"})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:190,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:"ORGANIZATION OR FIRM"})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:190}]}),(0,x.jsx)(o.G7,{style:[y.cell,{width:90}]}),(0,x.jsx)(o.G7,{style:[y.cell,{width:50,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:"IN"})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:50,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:"OUT"})})]},"headerRow3"),void 0!==l?l.map((function(e,l){return(0,x.jsxs)(o.G7,{style:y.row,children:[(0,x.jsx)(o.G7,{style:[y.cell,{width:43,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:""!==e.filler?a()(new Date(1e3*e.created.seconds)).format("DD"):null})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:190,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:""!==e.filler?e.name:null})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:45,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:""!==e.filler?e.rank:null})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:190,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:""!==e.filler?e.org:null})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:190,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:""!==e.filler?e.escort:null})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:90,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:""!==e.filler?e.badge:null})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:50,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:""!==e.filler?a()(new Date(1e3*e.created.seconds)).format("h:mm a"):null})}),(0,x.jsx)(o.G7,{style:[y.cell,{width:50,paddingTop:10}],children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:""!==e.filler?a()(new Date(1e3*e.signedOut.seconds)).format("h:mm a"):null})})]},l)})):null,(0,x.jsxs)(o.G7,{style:{flexDirection:"row"},children:[(0,x.jsx)(o.G7,{style:{width:325,paddingLeft:2,paddingTop:1},children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica-Bold",fontSize:10,fontWeight:"bold"},children:"AF IMT 1109, 19990501, V2"})}),(0,x.jsx)(o.G7,{style:{width:190,paddingLeft:2,paddingTop:1},children:(0,x.jsx)(o.xv,{style:{fontFamily:"Helvetica",fontSize:8},children:"PREVIOUS EDITIONS ARE OBSOLETE."})})]},"footerRow1")]})},"pages")})):null})})})}},2480:function(){}}]);
//# sourceMappingURL=584.fa92a9fd.chunk.js.map