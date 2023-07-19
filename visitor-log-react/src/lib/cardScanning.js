import { checkDBIDS } from "./checkDBIDS"

// '**********************************************
// 'DoD ID Card Scanning Function Library
// 'Version 23 August 2022
// 'Author- MSgt Bob Kaster (robert.kaster@us.af.mil)
// 'Ported to Javascript by- SrA Kyle Condon (kyle.condon@us.af.mil)
// ' Data used to develop this list came from the DMDC DoD ID Bar Codes & Software Development Kit, Version 7.5.1, Sep 2014
// '  and DMDC Memorandum "Changes to the Two-Dimensional Barcode on DoD Identification Cards", 15 Aug 2016
// ' Driver License data from AAMVA DL/ID Card Design Standard 2020
// ' - https://www.aamva.org/topics/driver-license-and-identification-standards and https://www.aamva.org/getmedia/99ac7057-0f4d-4461-b0a2-3a5532e1b35c/AAMVA-2020-DLID-Card-Design-Standard.pdf
// '**********************************************


export async function cardScan(scanned) {
    let barcode = scanned.replace("'", "")
    let ScanLib = {}
    let splitBarcode = {}

    switch (barcode.charAt(0)) {
        case "@":
            if (barcode.search("ANSI") !== -1) {
                ScanLib["Rank"] = "CIV"
                splitBarcode = barcode.split(" ")
                if (splitBarcode.length < 15) {splitBarcode = barcode.split("\r\n")}

                splitBarcode.forEach(e => {
                    switch (e.substring(0,3)) {
                        case "DAC": if (ScanLib["FN"] === undefined) {ScanLib["FN"] = e.substring(3, e.length)}; break;
                        case "DAD": if (ScanLib["MI"] === undefined) {ScanLib["MI"] = e.substring(3, e.length)}; break;
                        case "DCS": if (ScanLib["LN"] === undefined) {ScanLib["LN"] = e.substring(3, e.length)}; break;
                        case "DCT": if (ScanLib["FMN"] === undefined) {ScanLib["FMN"] = e.substring(3, e.length)}; break;
                        default: 
                    }
                });
            }
            break;
        case "N":
            if (barcode.length === 89) {
                //ScanLib["EDIPI"] = ConvDec(CStr(barcode.substring(9, 7)), 32)
                ScanLib["FN"] = barcode.substring(15, 20 + 15).trim();
                ScanLib["LN"] = barcode.substring(35, 26 + 35).trim();
                ScanLib["PCC"] = barcode.substring(65, 1 + 65).trim();
                ScanLib["Rank"] = barcode.substring(69, 6 + 69).trim();
                ScanLib["MI"] = barcode.substring(88, 1 + 88).trim();
            }
            break;
        case "M":
            if (barcode.length === 99) {
                //ScanLib.Add "EDIPI", ConvDec(Trim(barcode.substring(2, 7)), 32)
                ScanLib["FN"] = barcode.substring(16, 20 + 16).trim()
                ScanLib["MI"] = barcode.substring(36, 1 + 36).trim()
                ScanLib["LN"] = barcode.substring(37, 26 + 37).trim()
                ScanLib["PCC"] = barcode.substring(70, 1 + 70).trim()
                if (barcode.substring(80, 5 + 80).charAt(0) === "M") {ScanLib["Rank"] = barcode.substring(74, 5 + 74).trim()}
                if (barcode.substring(80, 5 + 80).charAt(0) !== "M") {ScanLib["Rank"] = barcode.substring(79, 5 + 79).trim()}
            }
            break;
        case "4":
            if (barcode.length === 100) {
                //ScanLib["EDIPI"] = ConvDec(barcode.substring(3, 7), 32)
                ScanLib["FN"] = barcode.substring(17, 20 + 17).trim()
                ScanLib["MI"] = barcode.substring(37, 1 + 37).trim()
                ScanLib["LN"] = barcode.substring(38, 26 + 38).trim()
                ScanLib["PCC"] = barcode.substring(71, 1 + 71).trim()
                ScanLib["Rank"] = barcode.substring(75, 6 + 75).trim()
            }
            if (barcode.length === 157) {
                //ScanLib["EDIPI"] = ConvDec(CStr(barcode.substring(3, 7)), 32)
                ScanLib["FN"] = barcode.substring(17, 20 + 17).trim()
                ScanLib["MI"] = barcode.substring(37, 1 + 37).trim()
                ScanLib["LN"] = barcode.substring(38, 26 + 38).trim()
                ScanLib["PCC"] = barcode.substring(128, 1 + 128).trim()
                ScanLib["Rank"] = barcode.substring(132, 6 + 132).trim()
            }
            break;
        case "1":
            // if (barcode.length === 18) {
            //     ScanLib.Add "EDIPI", ConvDec(barcode.substring(9, 7), 32)
            //     ScanLib.Add "PCC", barcode.substring(16, 1)
            //     userinfo = gigIDldap(False, , ScanLib("EDIPI") & ScanLib("PCC"))
            //     ScanLib.Add "FN", userinfo(0)
            //     ScanLib.Add "MI", userinfo(1)
            //     ScanLib.Add "LN", userinfo(2)
            //     ScanLib.Add "Rank", userinfo(3)
            // }
            if (barcode.length === 88) {
                //ScanLib["EDIPI"] = ConvDec(barcode.substring(9, 7), 32)
                ScanLib["FN"] = barcode.substring(15, 20 + 15).trim()
                ScanLib["LN"] = barcode.substring(35, 26 + 35).trim()
                ScanLib["PCC"] = barcode.substring(65, 1 + 65).trim()
                ScanLib["Rank"] = barcode.substring(60, 6 + 60).trim()
            }
            break;
        default: 
            ScanLib = await checkDBIDS(scanned)
            return ScanLib
    }
    return ScanLib
}


/*
Public Function gigIDldap(useEmail As Boolean, Optional mail As String, Optional gigid As String) As Variant
    Dim AFDS As String
    Const ADS_SCOPE_SUBTREE = 2
    Dim userinfo(15) As Variant
    If gigid = "" Then gigid = "1"
    Set objConnection = CreateObject("ADODB.Connection")
    Set objCommand = CreateObject("ADODB.Command")
    objConnection.Provider = "ADsDSOObject"
    objConnection.Open "Active Directory Provider"
    Set objCommand.ActiveConnection = objConnection
    objCommand.Properties("Page Size") = 1
    objCommand.Properties("Searchscope") = ADS_SCOPE_SUBTREE
    AFDS = ADaddress()
    'setup AFDS query
    If useEmail Then
        objCommand.CommandText = "SELECT * FROM 'LDAP://" & AFDS & "' WHERE objectCategory='user' AND mail='" & mail & "'"
    Else
        objCommand.CommandText = "SELECT * FROM 'LDAP://" & AFDS & "' WHERE objectCategory='user' AND gigid='" & gigid & "'"
    End If
    Set objRecordSet = objCommand.Execute
    If objRecordSet.RecordCount = 0 Then
        gigid = ""
        Exit Function
    Else
        objRecordSet.MoveFirst
    End If
    Set objUser = GetObject(objRecordSet.Fields("ADsPath").value)
    With objUser
        userinfo(0) = .givenName
        userinfo(1) = .Initials
        userinfo(2) = .LastName
        userinfo(3) = .personalTitle
        userinfo(4) = .DisplayName
        userinfo(5) = .userPrincipalName
        userinfo(6) = .o
        userinfo(7) = .sAMAccountName
        userinfo(8) = .mail
        userinfo(9) = .physicalDeliveryOfficeName
        userinfo(10) = .telephoneNumber
        userinfo(11) = .l
        userinfo(12) = .c
        userinfo(13) = .Title
        userinfo(14) = .Department
        userinfo(15) = .company
        'Debug.Print userinfo(12)
    End With
    gigIDldap = userinfo
End Function
Function ADaddress()
    'This script can determine the AD directory required for LDAP queries
    Set objSysInfo = CreateObject("ADSystemInfo")
    Set objUser = GetObject("LDAP://" & objSysInfo.UserName)
    dname = objUser.distinguishedName
    DLoc = InStr(dname, "DC=")
    ADaddress = Right(dname, Len(dname) - DLoc + 1)
End Function
 */