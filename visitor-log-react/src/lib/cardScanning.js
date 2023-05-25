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
'On Error GoTo entererror
    Dim userinfo As Variant
    barcode = Replace(barcode, "'", "")
    scantype = CAC
    'Function- Decode scanned DOD ID barcode and present user readable data
    'Arguments- barcode (String)
    'Return- Decoded card values stored in ScanLib dictionary
    ScanLib.RemoveAll 'clear out the dictionary just in case it hasn't been cleared yet
    Set ScanLib = New Scripting.Dictionary
    Select Case Left(barcode, 1)
        Case 1
            GoTo Ver1
        Case "N"
            GoTo VerN
        Case "M"
            GoTo VerM
        Case 4
            GoTo Ver4
        Case "@"
            scantype = DL
            GoTo VerDL
        Case Else
            GoTo NonSup
    End Select
Ver1:
    If Len(barcode) = 18 Then
        ScanLib.Add "DNote", "CAC Code 39 Ver. 1/Len 18"
        ScanLib.Add "DCode", barcode
        ScanLib.Add "EDIPI", ConvDec(Mid(barcode, 9, 7), 32)
        ScanLib.Add "PCC", Mid(barcode, 16, 1)
        userinfo = gigIDldap(False, , ScanLib("EDIPI") & ScanLib("PCC"))
        ScanLib.Add "FN", userinfo(0)
        ScanLib.Add "MI", userinfo(1)
        ScanLib.Add "LN", userinfo(2)
        ScanLib.Add "Rank", userinfo(3)
        GoTo ScanExit
    End If
    If Len(barcode) = 88 Then
        ScanLib.Add "DNote", "CAC PDF417 Ver.1/Len 88"
        ScanLib.Add "DCode", barcode
        ScanLib.Add "EDIPI", ConvDec(Mid(barcode, 9, 7), 32)
        ScanLib.Add "FN", Trim(Mid(barcode, 16, 20))
        ScanLib.Add "LN", Trim(Mid(barcode, 36, 26))
        ScanLib.Add "PCC", Mid(barcode, 66, 1)
        ScanLib.Add "Rank", Trim(Mid(barcode, 70, 6))
        GoTo ScanExit
    End If
    GoTo NonSup

Ver4:
    If Len(barcode) = 100 Then
        ScanLib.Add "DNote", "Sponsor PDF417 ver. 4/Len 100"
        ScanLib.Add "DCode", barcode
        ScanLib.Add "EDIPI", ConvDec(Mid(barcode, 3, 7), 32)
        ScanLib.Add "FN", Trim(Mid(barcode, 18, 20))
        ScanLib.Add "MI", Mid(barcode, 38, 1)
        ScanLib.Add "LN", Trim(Mid(barcode, 39, 26))
'        ScanLib.Add "DOB", CDate(DateSerial(1000, 1, 1) + (ConvDec(Mid(barcode, 65, 4), 32)))
'        ScanLib.Add "CN", Trim(Mid(barcode, 69, 3))
        ScanLib.Add "PCC", Mid(barcode, 72, 1)
'        ScanLib.Add "BC", Mid(barcode, 73, 1)
'        ScanLib.Add "PECT", Mid(barcode, 74, 2)
        ScanLib.Add "Rank", Trim(Mid(barcode, 76, 6))
'        ScanLib.Add "PPC", Mid(barcode, 82, 2)
'        ScanLib.Add "PPG", Right("00" & Trim(Mid(barcode, 84, 2)), 2)
'        ScanLib.Add "CII", Mid(barcode, 86, 1)
'        ScanLib.Add "CID", CDate(DateSerial(1000, 1, 1) + (ConvDec(Mid(barcode, 87, 4), 32)))
'        ScanLib.Add "CED", CDate(DateSerial(1000, 1, 1) + (ConvDec(Mid(barcode, 91, 4), 32)))
'        ScanLib.Add "UCI", ConvDec(Mid(barcode, 95, 6), 32)
        GoTo ScanExit
    End If
    If Len(barcode) = 157 Then
        ScanLib.Add "DNote", "Dependent PDF417 ver. 4/Len 157"
        ScanLib.Add "DCode", barcode
'        ScanLib.Add "VC", Left(barcode, 1)
'        ScanLib.Add "SF", Mid(barcode, 2, 1)
        ScanLib.Add "EDIPI", ConvDec(CStr(Mid(barcode, 3, 7)), 32)
'        ScanLib.Add "DBN", ConvDec(CStr(Mid(barcode, 10, 8)), 32)
        ScanLib.Add "FN", Trim(Mid(barcode, 18, 20))
        ScanLib.Add "MI", Mid(barcode, 38, 1)
        ScanLib.Add "LN", Trim(Mid(barcode, 39, 26))
'        ScanLib.Add "SRel", Mid(barcode, 65, 2)
'        ScanLib.Add "DOB", CDate(DateSerial(1000, 1, 1) + (ConvDec(CStr(Mid(barcode, 67, 4)), 32)))
'        ScanLib.Add "CN", Trim(Mid(barcode, 71, 3))
'        ScanLib.Add "SEDIPI", ConvDec(CStr(Mid(barcode, 74, 7)), 32)
'        ScanLib.Add "SFN", Trim(Mid(barcode, 81, 20))
'        ScanLib.Add "SMI", Mid(barcode, 101, 1)
'        ScanLib.Add "SLN", Trim(Mid(barcode, 102, 26))
'        ScanLib.Add "SDF", Mid(barcode, 128, 1)
        ScanLib.Add "PCC", Mid(barcode, 129, 1)
'        ScanLib.Add "SBC", Mid(barcode, 130, 1)
'        ScanLib.Add "SPECT", Mid(barcode, 131, 2)
        ScanLib.Add "Rank", Trim(Mid(barcode, 133, 6))
'        ScanLib.Add "SPPC", Mid(barcode, 139, 2)
'        ScanLib.Add "SPPG", Right("000" & Trim(Mid(barcode, 141, 2)), 2)
'        ScanLib.Add "CII", Mid(barcode, 143, 1)
'        ScanLib.Add "CID", CDate(DateSerial(1000, 1, 1) + (ConvDec(CStr(Mid(barcode, 144, 4)), 32)))
'        ScanLib.Add "CED", CDate(DateSerial(1000, 1, 1) + (ConvDec(CStr(Mid(barcode, 148, 4)), 32)))
'        ScanLib.Add "UCI", ConvDec(CStr(Mid(barcode, 152, 6)), 32)
        GoTo ScanExit
    End If
    GoTo NonSup

VerN:
    If Len(barcode) = 89 Then
        ScanLib.Add "DNote", "CAC PDF417 ver. N/Len 89"
        ScanLib.Add "DCode", barcode
'        ScanLib.Add "VC", Left(barcode, 1)
'        ScanLib.Add "PDI", Right("000000000" & CStr(ConvDec(Mid(barcode, 2, 6), 32)), 9)
'        ScanLib.Add "PDIt", Mid(barcode, 8, 1)
        ScanLib.Add "EDIPI", ConvDec(CStr(Mid(barcode, 9, 7)), 32)
        ScanLib.Add "FN", Trim(Mid(barcode, 16, 20))
        ScanLib.Add "LN", Trim(Mid(barcode, 36, 26))
'        ScanLib.Add "DOB", CDate(DateSerial(1000, 1, 1) + (ConvDec(CStr(Mid(barcode, 62, 4)), 32)))
        ScanLib.Add "PCC", Mid(barcode, 66, 1)
'        ScanLib.Add "BC", Mid(barcode, 67, 1)
'        ScanLib.Add "PECT", Mid(barcode, 68, 2)
        ScanLib.Add "Rank", Trim(Mid(barcode, 70, 6))
'        ScanLib.Add "PPC", Mid(barcode, 76, 2)
'        ScanLib.Add "PPG", Mid(barcode, 78, 2)
'        ScanLib.Add "CID", CDate(DateSerial(1000, 1, 1) + (ConvDec(CStr(Mid(barcode, 84, 4)), 32)))
'        ScanLib.Add "CED", CDate(DateSerial(1000, 1, 1) + (ConvDec(CStr(Mid(barcode, 84, 4)), 32)))
'        ScanLib.Add "CII", Mid(barcode, 88, 1)
        ScanLib.Add "MI", Mid(barcode, 89, 1)
        GoTo ScanExit
    End If
    GoTo NonSup

VerM:
    If Len(barcode) = 99 Then
        ScanLib.Add "DNote", "CAC PDF417 ver. M/Len 99"
        ScanLib.Add "DCode", barcode
'        ScanLib.Add "VC", Left(barcode, 1)
        ScanLib.Add "EDIPI", ConvDec(Trim(Mid(barcode, 2, 7)), 32)
'        ScanLib.Add "DBN", ConvDec(Trim(Mid(barcode9, 8)), 32)
        ScanLib.Add "FN", Trim(Mid(barcode, 17, 20))
        ScanLib.Add "MI", Mid(barcode, 37, 1)
        ScanLib.Add "LN", Trim(Mid(barcode, 38, 26))
'        ScanLib.Add "DOB", DateSerial(1000, 1, 1) + ConvDec(Trim(Mid(barcode, 64, 4)), 32)
'        ScanLib.Add "CN", Trim(Mid(barcode, 68, 3))
        ScanLib.Add "PCC", Mid(barcode, 71, 1)
'        ScanLib.Add "BC", Mid(barcode, 72, 1)
'        ScanLib.Add "PECT", Mid(barcode, 73, 2)
        If Left(Trim(Mid(barcode, 80, 5)), 1) = "M" Then ScanLib.Add "Rank", Trim(Mid(barcode, 75, 5))
        If Left(Trim(Mid(barcode, 80, 5)), 1) <> "M" Then ScanLib.Add "Rank", Trim(Mid(barcode, 80, 5))
'        ScanLib.Add "PPC", Mid(barcode, 81, 2)
'        ScanLib.Add "PPG", Right("000" & Trim(Mid(barcode, 83, 2)), 2)
'        ScanLib.Add "CII", Mid(barcode, 85, 1)
'        ScanLib.Add "CID", DateSerial(1000, 1, 1) + ConvDec(Trim(Mid(barcode, 86, 4)), 32)
'        ScanLib.Add "CED", DateSerial(1000, 1, 1) + ConvDec(Trim(Mid(barcode, 90, 4)), 32)
'        ScanLib.Add "UCI", ConvDec(Trim(Mid(barcode, 94, 6)), 32)
        GoTo ScanExit
    End If
    GoTo NonSup

VerDL:
    ScanLib.Add "VC", Left(barcode, 1)
    ScanLib.Add "DNote", "AAMVA DL/ID"
    ScanLib.Add "DCode", barcode
    Dim co As Integer
    Dim cs As String
    Dim sbto As Integer
    Dim dls As Integer
    Dim dlln As Integer
    Dim sfc As Integer
    Dim dfile As String
    Dim darray() As String
    Dim jflg As String
    If Mid(barcode, InStr(barcode, " ") - 4, 5) <> "ANSI " Then
        GoTo NonSup
    End If
    co = InStr(barcode, " ") - 4
    ScanLib.Add "FT", Mid(barcode, co, 5)
    ScanLib.Add "IIN", Mid(barcode, co + 5, 6)
    ScanLib.Add "AVN", Mid(barcode, co + 11, 2)
    ScanLib.Add "JVN", Mid(barcode, co + 13, 2)
    ScanLib.Add "SFN", Mid(barcode, co + 15, 2)
    sfc = CInt(Mid(barcode, co + 15, 2))
    sbto = co + 17
    For i = 1 To sfc
        ScanLib.Add "SBT" & i, Mid(barcode, sbto + (i * 10) - 10, 2)
        ScanLib.Add "SBTO" & i, Mid(barcode, sbto + (i * 10) - 8, 4)
        ScanLib.Add "SBTL" & i, Mid(barcode, sbto + (i * 10) - 4, 4)
        If Mid(barcode, sbto + (i * 10) - 10, 2) = "DL" Then
            dls = Mid(barcode, sbto + (i * 10) - 8, 4)
            dlln = ScanLib("SBTO" & i)
        End If
        If Mid(barcode, sbto + (i * 10) - 10, 1) = "Z" Then jflg = Mid(barcode, sbto + (i * 10) - 10, 2) & Mid(barcode, sbto + (i * 10) - 10, 2)
    Next i
    dfile = Mid(barcode, dls + co - 2, Len(barcode))
    darray = Split(dfile, Chr(10))
    ScanLib.Add "Rank", "Civ"
    For Each e In darray
        cs = e
        cs = Replace(cs, Chr(13), "")
        cs = Replace(cs, Chr(10), "")
        'If InStr(cs, jflg) <> 0 Then cs = Left(cs, InStr(cs, jflg) - 1)
        e = cs
        If Left(e, 1) <> "Z" Then
            Select Case Left(e, 3)
                Case "DAC": If Not ScanLib.Exists("FN") Then ScanLib.Add "FN", Trim(Mid(e, 4, Len(e)))     ' First Name V40ANS
                Case "DAD": If Not ScanLib.Exists("MI") Then ScanLib.Add "MI", Trim(Mid(e, 4, Len(e)))     ' Middle Name V40ANS
'                Case "DAG": If Not ScanLib.Exists("AD1") Then ScanLib.Add "AD1", Trim(Mid(e, 4, Len(e)))    ' Address Street 1 V35ANS
'                Case "DAH": If Not ScanLib.Exists("AD2") Then ScanLib.Add "AD2", Trim(Mid(e, 4, Len(e)))    ' Address Street 2 V35ANS
'                Case "DAI": If Not ScanLib.Exists("CTY") Then ScanLib.Add "CTY", Trim(Mid(e, 4, Len(e)))    ' Address City V20ANS
'                Case "DAJ": If Not ScanLib.Exists("ST") Then ScanLib.Add "ST", Trim(Mid(e, 4, Len(e)))     ' Address State F2A
'                Case "DAK": If Not ScanLib.Exists("ZIP") Then ScanLib.Add "ZIP", Trim(Mid(e, 4, Len(e)))    ' Address Zip F11ANS
'                Case "DAQ": If Not ScanLib.Exists("DLN") Then ScanLib.Add "DLN", Trim(Mid(e, 4, Len(e)))    ' DL/ID Number V25ANS
'                Case "DAU": If Not ScanLib.Exists("HGT") Then ScanLib.Add "HGT", Trim(Mid(e, 4, Len(e)))    ' Height F6ANS
'                Case "DAW": If Not ScanLib.Exists("WGTP") Then ScanLib.Add "WGTP", Trim(Mid(e, 4, Len(e)))   ' Weight Pounds F3N
'                Case "DAX": If Not ScanLib.Exists("WGTK") Then ScanLib.Add "WGTK", Trim(Mid(e, 4, Len(e)))   ' Weight Kilos F3N
'                Case "DAY": If Not ScanLib.Exists("EYES") Then ScanLib.Add "EYES", Trim(Mid(e, 4, Len(e)))   ' Eye Color F3A
'                Case "DAZ": If Not ScanLib.Exists("HAIR") Then ScanLib.Add "HAIR", Trim(Mid(e, 4, Len(e)))   ' Hair Color V12A
'                Case "DBA": If Not ScanLib.Exists("CED") Then ScanLib.Add "CED", Trim(Mid(e, 4, Len(e)))    ' Expiration Date F8N MMDDCCYY
'                Case "DBB": If Not ScanLib.Exists("DOB") Then ScanLib.Add "DOB", Trim(Mid(e, 4, Len(e)))    ' Birth Date F8N MMDDCCYY
'                Case "DBC": If Not ScanLib.Exists("GEN") Then ScanLib.Add "GEN", Trim(Mid(e, 4, Len(e)))    ' Gender 1 = male, 2 = female, 9 = not specified F1N
'                Case "DBD": If Not ScanLib.Exists("CID") Then ScanLib.Add "CID", Trim(Mid(e, 4, Len(e)))    ' Issue Date F8N MMDDCCYY
'                Case "DBG": If Not ScanLib.Exists("AKAF") Then ScanLib.Add "AKAF", Trim(Mid(e, 4, Len(e)))   ' Alias First V15ANS
'                Case "DBN": If Not ScanLib.Exists("AKAL") Then ScanLib.Add "AKAL", Trim(Mid(e, 4, Len(e)))   ' Alias Last V10ANS
'                Case "DBS": If Not ScanLib.Exists("AKAS") Then ScanLib.Add "AKAS", Trim(Mid(e, 4, Len(e)))   ' Alias Suffix V5ANS
'                Case "DCA": If Not ScanLib.Exists("VCL") Then ScanLib.Add "VCL", Trim(Mid(e, 4, Len(e)))    ' Vehicle Class V6ANS
'                Case "DCB": If Not ScanLib.Exists("VRS") Then ScanLib.Add "VRS", Trim(Mid(e, 4, Len(e)))    ' Restrictions V12ANS
'                Case "DCD": If Not ScanLib.Exists("VEN") Then ScanLib.Add "VEN", Trim(Mid(e, 4, Len(e)))    ' Endorsements V5ANS
'                Case "DCE": If Not ScanLib.Exists("WGTR") Then ScanLib.Add "WGTR", Trim(Mid(e, 4, Len(e)))   ' Weight Range F1N
'                Case "DCF": If Not ScanLib.Exists("CII") Then ScanLib.Add "CII", Trim(Mid(e, 4, Len(e)))    ' Document Discriminator V25ANS
'                Case "DCG": If Not ScanLib.Exists("NAT") Then ScanLib.Add "NAT", Trim(Mid(e, 4, Len(e)))    ' Issue country USA/CAN F3A
'                Case "DCI": If Not ScanLib.Exists("POB") Then ScanLib.Add "POB", Trim(Mid(e, 4, Len(e)))    ' Place of birth V33A
'                Case "DCJ": If Not ScanLib.Exists("AUD") Then ScanLib.Add "AUD", Trim(Mid(e, 4, Len(e)))    ' Audit Info V25ANS
'                Case "DCK": If Not ScanLib.Exists("DCK") Then ScanLib.Add "DCK", Trim(Mid(e, 4, Len(e)))    ' Inventory Control Number V25ANS
'                Case "DCL": If Not ScanLib.Exists("ETH") Then ScanLib.Add "ETH", Trim(Mid(e, 4, Len(e)))    ' Race/Ethnicity V3A
'                Case "DCM": If Not ScanLib.Exists("SVC") Then ScanLib.Add "SVC", Trim(Mid(e, 4, Len(e)))    ' Standard Vehicle Class F4AN
'                Case "DCN": If Not ScanLib.Exists("SVE") Then ScanLib.Add "SVE", Trim(Mid(e, 4, Len(e)))    ' Standard Endorsement Code F5AN
'                Case "DCO": If Not ScanLib.Exists("SVR") Then ScanLib.Add "SVR", Trim(Mid(e, 4, Len(e)))    ' Standard Restriction Code F12AN
'                Case "DCP": If Not ScanLib.Exists("VCD") Then ScanLib.Add "VCD", Trim(Mid(e, 4, Len(e)))    ' Vehicle Class Description V50ANS
'                Case "DCQ": If Not ScanLib.Exists("ECD") Then ScanLib.Add "ECD", Trim(Mid(e, 4, Len(e)))    ' Endorsement Code Description V50ANS
'                Case "DCR": If Not ScanLib.Exists("RCD") Then ScanLib.Add "RCD", Trim(Mid(e, 4, Len(e)))    ' Restriction Code Descritpion V50ANS
                Case "DCS": If Not ScanLib.Exists("LN") Then ScanLib.Add "LN", Trim(Mid(e, 4, Len(e)))     ' Last Name V40ANS
                Case "DCT": If Not ScanLib.Exists("FMN") Then ScanLib.Add "FMN", Trim(Mid(e, 4, Len(e)))     ' Last Name V40ANS
'                Case "DCU": If Not ScanLib.Exists("SFX") Then ScanLib.Add "SFX", Trim(Mid(e, 4, Len(e)))    ' Name Suffix V5ANS
'                Case "DDA": If Not ScanLib.Exists("RIAC") Then ScanLib.Add "RIAC", Trim(Mid(e, 4, Len(e)))   ' DHS REAL ID Act Compliance F1A
'                Case "DDB": If Not ScanLib.Exists("CRD") Then ScanLib.Add "CRD", Trim(Mid(e, 4, Len(e)))    ' Card Revision Date (MMDDCCYY for U.S., CCYYMMDD for Canada) F8N
'                Case "DDC": If Not ScanLib.Exists("HAZ") Then ScanLib.Add "HAZ", Trim(Mid(e, 4, Len(e)))    ' HAZMAT Endorsement Expiration (MMDDCCYY for U.S., CCYYMMDD for Canada) F8N
'                Case "DDD": If Not ScanLib.Exists("LDDI") Then ScanLib.Add "LDDI", Trim(Mid(e, 4, Len(e)))   ' Limited Duration Document Indicator F1N
'                Case "DDE": If Not ScanLib.Exists("LNT") Then ScanLib.Add "LNT", Trim(Mid(e, 4, Len(e)))    ' Last name truncated (T)-truncated, (N)-not truncated, (U)-unknown F1A
'                Case "DDF": If Not ScanLib.Exists("FNT") Then ScanLib.Add "FNT", Trim(Mid(e, 4, Len(e)))    ' First name truncated (T)-truncated, (N)-not truncated, (U)-unknown F1A
'                Case "DDG": If Not ScanLib.Exists("MIT") Then ScanLib.Add "MIT", Trim(Mid(e, 4, Len(e)))    ' Middle name truncated (T)-truncated, (N)-not truncated, (U)-unknown F1A
'                Case "DDH": If Not ScanLib.Exists("U18") Then ScanLib.Add "U18", Trim(Mid(e, 4, Len(e)))    ' Under 18 Until (MMDDCCYY for U.S., CCYYMMDD for Canada) F8N
'                Case "DDI": If Not ScanLib.Exists("U19") Then ScanLib.Add "U19", Trim(Mid(e, 4, Len(e)))    ' Under 19 Until (MMDDCCYY for U.S., CCYYMMDD for Canada) F8N
'                Case "DDJ": If Not ScanLib.Exists("U21") Then ScanLib.Add "U21", Trim(Mid(e, 4, Len(e)))    ' Under 21 Until (MMDDCCYY for U.S., CCYYMMDD for Canada) F8N
'                Case "DDK": If Not ScanLib.Exists("ORG") Then ScanLib.Add "ORG", Trim(Mid(e, 4, Len(e)))    ' Organ Donor Indicator 1=Organ Donor F1N
'                Case "DDL": If Not ScanLib.Exists("VET") Then ScanLib.Add "VET", Trim(Mid(e, 4, Len(e)))    ' Veteran Indicator 1=Veteran F1N
            End Select
        End If
    Next e
    GoTo ScanExit


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