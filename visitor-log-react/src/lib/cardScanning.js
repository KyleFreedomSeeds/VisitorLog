export function cardScan(scanned) {
    let barcode = scanned.replace("'", "")
    let scantype = "CAC"
    let ScanLib = {}
    let splitBarcode = {}

    switch (barcode.charAt(0)) {
        case "@": 
            if (barcode.substring(barcode.search(" ")-4,10) === "ANSI") {
                ScanLib["Rank"] = "CIV"
                splitBarcode = barcode.split("\r\n")

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
            if (barcode.length == 89) {
                //ScanLib["EDIPI"] = ConvDec(CStr(barcode.substring(9, 7)), 32)
                ScanLib["FN"] = barcode.substring(16, 20);
                ScanLib["LN"] = barcode.substring(36, 26);
                ScanLib["PCC"] = barcode.substring(66, 1);
                ScanLib["Rank"] = barcode.substring(70, 6);
                ScanLib["MI"] = barcode.substring(89, 1);
            }
            break;
        case "M":
            if (barcode.length == 99) {
                //ScanLib.Add "EDIPI", ConvDec(Trim(barcode.substring(2, 7)), 32)
                ScanLib["FN"] = barcode.substring(17, 20)
                ScanLib["MI"] = barcode.substring(37, 1)
                ScanLib["LN"] = barcode.substring(38, 26)
                ScanLib["PCC"] = barcode.substring(71, 1)
                if (barcode.substring(80, 5).charAt(0) == "M") {ScanLib["Rank"] = barcode.substring(75, 5)}
                if (barcode.substring(80, 5).charAt(0) != "M") {ScanLib["Rank"] = barcode.substring(80, 5)}
            }
            break;
        case "4":
            if (barcode.length == 100) {
                //ScanLib["EDIPI"] = ConvDec(barcode.substring(3, 7), 32)
                ScanLib["FN"] = barcode.substring(18, 20)
                ScanLib["MI"] = barcode.substring(38, 1)
                ScanLib["LN"] = barcode.substring(39, 26)
                ScanLib["PCC"] = barcode.substring(72, 1)
                ScanLib["Rank"] = barcode.substring(76, 6)
            }
            if (barcode.length == 157) {
                //ScanLib["EDIPI"] = ConvDec(CStr(barcode.substring(3, 7)), 32)
                ScanLib["FN"] = barcode.substring(18, 20)
                ScanLib["MI"] = barcode.substring(38, 1)
                ScanLib["LN"] = barcode.substring(39, 26)
                ScanLib["PCC"] = barcode.substring(129, 1)
                ScanLib["Rank"] = barcode.substring(133, 6)
            }
            break;
        case "1":
            // if (barcode.length == 18) {
            //     ScanLib.Add "EDIPI", ConvDec(barcode.substring(9, 7), 32)
            //     ScanLib.Add "PCC", barcode.substring(16, 1)
            //     userinfo = gigIDldap(False, , ScanLib("EDIPI") & ScanLib("PCC"))
            //     ScanLib.Add "FN", userinfo(0)
            //     ScanLib.Add "MI", userinfo(1)
            //     ScanLib.Add "LN", userinfo(2)
            //     ScanLib.Add "Rank", userinfo(3)
            // }
            if (barcode.length == 88) {
                //ScanLib["EDIPI"] = ConvDec(barcode.substring(9, 7), 32)
                ScanLib["FN"] = barcode.substring(16, 20)
                ScanLib["LN"] = barcode.substring(36, 26)
                ScanLib["PCC"] = barcode.substring(66, 1)
                ScanLib["Rank"] = barcode.substring(70, 6)
            }
            break;
        default: return null
    }
    return ScanLib
}


/* '**********************************************
'DoD ID Card Scanning Function Library
'Version 23 August 2022
'Author- MSgt Bob Kaster (robert.kaster@us.af.mil)
' Data used to develop this list came from the DMDC DoD ID Bar Codes & Software Development Kit, Version 7.5.1, Sep 2014
'  and DMDC Memorandum "Changes to the Two-Dimensional Barcode on DoD Identification Cards", 15 Aug 2016
' Driver License data from AAMVA DL/ID Card Design Standard 2020
' - https://www.aamva.org/topics/driver-license-and-identification-standards and https://www.aamva.org/getmedia/99ac7057-0f4d-4461-b0a2-3a5532e1b35c/AAMVA-2020-DLID-Card-Design-Standard.pdf
'**********************************************

Public Function DumpLib()
    ' Dumps current contents of ScanLib to Immediate window
    If ScanLib.Exists("Err1") = True Then Exit Function
    For Each key In ScanLib.Keys
        If key <> "DCode" Then
            Debug.Print key & " " & Len(ScanLib(key)) & " " & ScanLib(key)
        End If
    Next key
End Function

Public Function CardScan(barcode As String)

NonSup:
    Set rs = CurrentDb.OpenRecordset("SELECT * FROM tblOther WHERE DBIDS_ID = '" & barcode & "'")
    If Not rs.EOF Then
        ScanLib.Add "FN", rs.Fields("Name").value
    Else
        newName = getstring("Enter Full Name of Scanned Personnel")
        DoCmd.Close acForm, "frmBarCap", acSaveNo
        If newName = "Null" Then End
        rs.AddNew
        rs.Fields("DBIDS_ID").value = barcode
        rs.Fields("Name").value = newName
        rs.Update
        ScanLib.Add "FN", newName
    End If
    
    ScanLib.Add "Rank", "Civ"
    ScanLib.Add "DCode", "111111111111111111"
    rs.Close
    Exit Function

entererror:
    ers = CurrentDb.OpenRecordset("tblErrors")
    ers.AddNew
    ers.Update
    ers.MoveLast
    ers.Edit
    ers.Fields("Error Type").value = "Scan Error"
    ers.Fields("Scanned").value = barcode
    ers.Update
ScanExit:
    If ScanLib("Rank") = "" Then
        userinfo = gigIDldap(False, , ScanLib("EDIPI") & ScanLib("PCC"))
        ScanLib("Rank") = userinfo(3)
    End If
    If scantype = CAC And (ScanLib("Rank") = "" Or Not ScanLib.Exists("Rank") Or IsNull(ScanLib("Rank"))) Or ((Left(ScanLib("Rank"), 1) = "M") And ScanLib("Rank") <> "MSGT" And ScanLib("Rank") <> "MAJ" And ScanLib("Rank") <> "MSG") Then
        Set ers = CurrentDb.OpenRecordset("tblErrors")
        ers.AddNew
        ers.Update
        ers.MoveLast
        ers.Edit
        ers.Fields("Error Type").value = "Rank Error"
        ers.Fields("Scanned").value = barcode
        ers.Update
    End If
    barcode = ""
    Exit Function
End Function

Public Function ConvDec(pNumber As String, pBase As Integer) As Double
'ConvDec is able to convert numbers up to base 35 to base 10
   Dim base, length, pos, temp, tmp As Long
   Dim MyValue As Variant 'variant - to hold letters
   Dim MaxLetter, i As Integer
   ConvDec = 0
   base = Len(pNumber) - 1
   length = Len(pNumber)
   pos = 1
   ' is pNumber within base range
   MaxLetter = pBase - 1
   For i = 1 To length
      If Asc(Mid(pNumber, i, 1)) - 55 > MaxLetter Then
         MsgBox "'" & pNumber & "' is not a base" & pBase & " number"
         Exit Function
      End If
   Next
   While base >= 0
      MyValue = Mid(pNumber, pos, 1)
      'A = ascii 65 and Z = ascii 90
      'convert letter to value
      If Asc(UCase(MyValue)) >= 65 And Asc(UCase(MyValue)) <= 90 Then
         tmp = CLng(Asc(UCase(MyValue)) - 55)
      Else
         tmp = CLng(MyValue)
      End If
      temp = temp + (tmp * (pBase ^ (base)))
      base = base - 1
      pos = pos + 1
   Wend
   ConvDec = temp
End Function
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