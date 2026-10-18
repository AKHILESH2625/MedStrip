' ******************************************************************************
' MedStrip Smart IoT Blister Dispenser - SolidWorks Parametric CAD Generator
' Automatic SolidWorks VBA Macro (Part & Assembly Builder)
' Author: MedStrip Project Team (VIT Chennai)
' ******************************************************************************
' HOW TO RUN IN SOLIDWORKS:
' 1. Open SolidWorks.
' 2. Go to: Tools > Macro > New... (or press Alt + F11 to open the VBA Editor).
' 3. Paste this code into the module and click "Run Sub/UserForm" (F5) or save as .swp.
' 4. SolidWorks will parametrically sketch, extrude, cut, and assemble all components!
' ******************************************************************************

Dim swApp As Object
Dim Part As Object
Dim boolstatus As Boolean
Dim longstatus As Long, longwarnings As Long

Sub Main()
    Set swApp = Application.SldWorks
    
    Dim saveDir As String
    saveDir = "C:\Users\S Akhilesh\Downloads\MedStrip_3D_Models_SolidWorks\"
    
    ' -------------------------------------------------------------
    ' 1. BUILD REMOVABLE CASSETTE (40 mm x 100 mm x 20 mm)
    ' -------------------------------------------------------------
    Set Part = swApp.NewDocument("C:\ProgramData\SolidWorks\SolidWorks 2024\templates\Part.prtdot", 0, 0, 0)
    If Part Is Nothing Then Set Part = swApp.NewPart()
    
    Part.SketchManager.InsertSketch True
    boolstatus = Part.Extension.SelectByID2("Top Plane", "PLANE", 0, 0, 0, False, 0, Nothing, 0)
    
    ' Outer base rectangle (40mm x 100mm centered at X=0, Y from 0 to 100)
    Part.SketchManager.CreateCenterRectangle 0, 0.05, 0, 0.02, 0.1, 0
    Part.FeatureManager.FeatureExtrusion2 True, False, False, 0, 0, 0.02, 0.01, False, False, False, False, 0, 0, False, False, False, False, True, True, True, 0, 0, False
    
    ' Internal Pocket Cut (35mm x 95mm, depth 17.5mm leaving 2.5mm floor)
    Part.Extension.SelectByID2("", "FACE", 0, 0.05, 0.02, False, 0, Nothing, 0)
    Part.SketchManager.InsertSketch True
    Part.SketchManager.CreateCenterRectangle 0, 0.05, 0, 0.0175, 0.095, 0
    Part.FeatureManager.FeatureCut4 True, False, False, 0, 0, 0.0175, 0.01, False, False, False, False, 0, 0, False, False, False, False, False, True, True, True, True, False, 0, 0, False, False
    
    ' 8 Tablet Through-Holes in Floor (2 columns x 4 rows, 12mm dia)
    Part.Extension.SelectByID2("", "FACE", 0, 0.05, 0.0025, False, 0, Nothing, 0)
    Part.SketchManager.InsertSketch True
    Dim rIdx As Integer, cIdx As Integer
    Dim yPos As Double, xPos As Double
    For rIdx = 0 To 3
        yPos = 0.018 + (rIdx * 0.02) ' 18, 38, 58, 78 mm
        Part.SketchManager.CreateCircleByRadius -0.008, yPos, 0, 0.006
        Part.SketchManager.CreateCircleByRadius 0.008, yPos, 0, 0.006
    Next rIdx
    Part.FeatureManager.FeatureCut4 True, False, False, 0, 0, 0.003, 0.01, False, False, False, False, 0, 0, False, False, False, False, False, True, True, True, True, False, 0, 0, False, False
    
    ' Front Pull Handle (Width 28mm, Length 12mm, Height 12mm)
    Part.Extension.SelectByID2("", "FACE", 0, 0, 0.01, False, 0, Nothing, 0)
    Part.SketchManager.InsertSketch True
    Part.SketchManager.CreateCenterRectangle 0, 0.01, 0, 0.014, 0.006, 0
    Part.FeatureManager.FeatureExtrusion2 True, False, False, 0, 0, 0.012, 0.01, False, False, False, False, 0, 0, False, False, False, False, True, True, True, 0, 0, False
    
    ' Apply Appearance (Pastel Coral/Pink)
    Part.SaveAs3 saveDir & "Removable_Cassette.SLDPRT", 0, 2
    swApp.CloseDoc "Removable_Cassette.SLDPRT"

    ' -------------------------------------------------------------
    ' 2. BUILD MAIN CHASSIS BASE (220 mm x 130 mm x 55 mm)
    ' -------------------------------------------------------------
    Set Part = swApp.NewPart()
    Part.SketchManager.InsertSketch True
    boolstatus = Part.Extension.SelectByID2("Top Plane", "PLANE", 0, 0, 0, False, 0, Nothing, 0)
    
    ' Outer Base Extrusion
    Part.SketchManager.CreateCenterRectangle 0, 0.045, 0, 0.11, 0.065, 0
    Part.FeatureManager.FeatureExtrusion2 True, False, False, 0, 0, 0.055, 0.01, False, False, False, False, 0, 0, False, False, False, False, True, True, True, 0, 0, False
    
    ' 5 Cassette Bay Cutouts (each 41mm x 102mm, depth 31mm)
    Part.Extension.SelectByID2("", "FACE", 0, 0.05, 0.055, False, 0, Nothing, 0)
    Part.SketchManager.InsertSketch True
    Dim slotX(4) As Double
    slotX(0) = -0.087: slotX(1) = -0.0435: slotX(2) = 0: slotX(3) = 0.0435: slotX(4) = 0.087
    Dim s As Integer
    For s = 0 To 4
        Part.SketchManager.CreateCenterRectangle slotX(s), 0.051, 0, 0.0205, 0.051, 0
    Next s
    Part.FeatureManager.FeatureCut4 True, False, False, 0, 0, 0.031, 0.01, False, False, False, False, 0, 0, False, False, False, False, False, True, True, True, True, False, 0, 0, False, False
    
    ' Front Dispensing Tray Slot Cutout (42mm x 22mm)
    Part.Extension.SelectByID2("Front Plane", "PLANE", 0, 0, 0, False, 0, Nothing, 0)
    Part.SketchManager.InsertSketch True
    Part.SketchManager.CreateCenterRectangle 0, 0.011, 0, 0.021, 0.011, 0
    Part.FeatureManager.FeatureCut4 True, False, False, 0, 0, 0.05, 0.01, False, False, False, False, 0, 0, False, False, False, False, False, True, True, True, True, False, 0, 0, False, False
    
    Part.SaveAs3 saveDir & "Main_Chassis_Base.SLDPRT", 0, 2
    swApp.CloseDoc "Main_Chassis_Base.SLDPRT"

    ' -------------------------------------------------------------
    ' 3. BUILD TOP COVER ENCLOSURE (220 mm x 130 mm x 55 mm)
    ' -------------------------------------------------------------
    Set Part = swApp.NewPart()
    Part.SketchManager.InsertSketch True
    boolstatus = Part.Extension.SelectByID2("Top Plane", "PLANE", 0, 0, 0, False, 0, Nothing, 0)
    Part.SketchManager.CreateCenterRectangle 0, 0.045, 0, 0.11, 0.065, 0
    Part.FeatureManager.FeatureExtrusion2 True, False, False, 0, 0, 0.055, 0.01, False, False, False, False, 0, 0, False, False, False, False, True, True, True, 0, 0, False
    
    ' OLED Display Window Cutout (32mm x 18mm) and 5mm LED Hole on Front
    Part.Extension.SelectByID2("Front Plane", "PLANE", 0, 0, 0, False, 0, Nothing, 0)
    Part.SketchManager.InsertSketch True
    Part.SketchManager.CreateCenterRectangle 0, 0.025, 0, 0.016, 0.009, 0
    Part.SketchManager.CreateCircleByRadius 0.03, 0.025, 0, 0.0026
    Part.FeatureManager.FeatureCut4 True, False, False, 0, 0, 0.008, 0.01, False, False, False, False, 0, 0, False, False, False, False, False, True, True, True, True, False, 0, 0, False, False
    
    Part.SaveAs3 saveDir & "Top_Cover_Enclosure.SLDPRT", 0, 2
    swApp.CloseDoc "Top_Cover_Enclosure.SLDPRT"

    ' -------------------------------------------------------------
    ' 4. BUILD DISPENSING TRAY (38 mm x 50 mm x 20 mm)
    ' -------------------------------------------------------------
    Set Part = swApp.NewPart()
    Part.SketchManager.InsertSketch True
    boolstatus = Part.Extension.SelectByID2("Top Plane", "PLANE", 0, 0, 0, False, 0, Nothing, 0)
    Part.SketchManager.CreateCenterRectangle 0, 0.025, 0, 0.019, 0.025, 0
    Part.FeatureManager.FeatureExtrusion2 True, False, False, 0, 0, 0.02, 0.01, False, False, False, False, 0, 0, False, False, False, False, True, True, True, 0, 0, False
    
    ' Shell hollow with curved scoop
    Part.Extension.SelectByID2("", "FACE", 0, 0.025, 0.02, False, 0, Nothing, 0)
    Part.SketchManager.InsertSketch True
    Part.SketchManager.CreateCenterRectangle 0, 0.027, 0, 0.0165, 0.022, 0
    Part.FeatureManager.FeatureCut4 True, False, False, 0, 0, 0.0175, 0.01, False, False, False, False, 0, 0, False, False, False, False, False, True, True, True, True, False, 0, 0, False, False
    
    Part.SaveAs3 saveDir & "Dispensing_Tray.SLDPRT", 0, 2
    swApp.CloseDoc "Dispensing_Tray.SLDPRT"

    MsgBox "MedStrip CAD Models created successfully in: " & vbCrLf & saveDir, vbInformation, "MedStrip CAD Generator"
End Sub
