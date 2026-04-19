#!/usr/bin/env python3
"""
Desmonds-Teders Family Tree PDF Generator
Creates a beautiful, printable family tree display
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, Rect, Circle, Line
from reportlab.graphics import renderPDF
from datetime import datetime

# Family data structure
family_generations = {
    "Generation 0 (Immigrants)": [
        {"name": "Henry John Teders", "born": "1857, Germany", "died": "Indiana", "spouse": "Anna Elizabeth Riemen", "note": "German immigrants, settled in Avilla, IN"}
    ],
    "Generation 1": [
        {"name": "Edward John Teders", "born": "1899", "died": "1989", "spouse": "Catherine Cecelia Mund", "note": "Caren's great-grandfather"},
        {"name": "Charles Henry Teders", "born": "", "died": "", "spouse": "", "note": ""},
        {"name": "Maria Rose Teders", "born": "", "died": "", "spouse": "", "note": ""},
        {"name": "Joseph August Teders", "born": "", "died": "", "spouse": "", "note": ""},
        {"name": "Henrietta Teders", "born": "", "died": "", "spouse": "", "note": ""},
        {"name": "Laura H. Teders", "born": "", "died": "", "spouse": "", "note": ""},
    ],
    "Generation 2": [
        {"name": "Joan Catherine Teders", "born": "Dec 30, 1930", "died": "Sep 14, 2016", "spouse": "1. Sherman J. Desmonds (1951)\n2. Jerome J. Houser", "note": "Caren's grandmother"},
        {"name": "Brunetta Marie Teders", "born": "", "died": "Sep 22, 2010", "spouse": "Paul E. Sible (1949)", "note": "Avilla, IN"},
        {"name": "Clifford J. Teders", "born": "Dec 3, 1933", "died": "Sep 4, 2012", "spouse": "Joyce", "note": "U.S. Army veteran"},
        {"name": "Paul W. Teders", "born": "", "died": "", "spouse": "", "note": "WWII veteran, B&O Railroad"},
        {"name": "Arnold Teders", "born": "", "died": "", "spouse": "", "note": "Avilla, IN"},
    ],
    "Generation 3 (Subject)": [
        {"name": "Sherman James Desmonds", "born": "Nov 11, 1930", "died": "Jun 10, 1971", "spouse": "Joan Catherine Teders (1951)", "note": "Korean War veteran • Caren's grandfather"},
    ],
    "Generation 4": [
        {"name": "Steve Desmonds", "born": "", "died": "", "spouse": "Susan", "note": "Caren's father"},
        {"name": "Sue Desmonds", "born": "", "died": "", "spouse": "Mike Moorhead", "note": ""},
        {"name": "Diane Desmonds", "born": "", "died": "", "spouse": "Robert A. Phillips II (1983)", "note": ""},
        {"name": "Dave Desmonds", "born": "", "died": "", "spouse": "Dawn", "note": "Kendallville, IN"},
    ],
    "Generation 5": [
        {"name": "Caren Desmonds", "born": "", "died": "", "spouse": "Kyle Dudgeon", "note": ""},
    ],
    "Generation 6": [
        {"name": "Braxton Dudgeon", "born": "Jul 8, 2017", "died": "", "spouse": "", "note": "Age 8"},
    ]
}

def create_family_tree_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=landscape(letter),
        rightMargin=0.5*inch,
        leftMargin=0.5*inch,
        topMargin=0.5*inch,
        bottomMargin=0.5*inch
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontName='Arial',
        fontSize=28,
        textColor=colors.HexColor('#2C5F2D'),
        spaceAfter=12,
        alignment=1  # Center
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontName='Arial',
        fontSize=12,
        textColor=colors.HexColor('#5D4E37'),
        spaceAfter=20,
        alignment=1
    )
    
    gen_header_style = ParagraphStyle(
        'GenHeader',
        parent=styles['Heading2'],
        fontName='Arial',
        fontSize=14,
        textColor=colors.HexColor('#8B4513'),
        spaceAfter=6,
        spaceBefore=12
    )
    
    person_name_style = ParagraphStyle(
        'PersonName',
        parent=styles['Normal'],
        fontSize=10,
        fontName='Arial-Bold',
        textColor=colors.HexColor('#2C5F2D')
    )
    
    person_info_style = ParagraphStyle(
        'PersonInfo',
        parent=styles['Normal'],
        fontName='Arial',
        fontSize=8,
        textColor=colors.HexColor('#5D4E37')
    )
    
    story = []
    
    # Title
    story.append(Paragraph("🌳 THE DESMONDS-TEDERS FAMILY TREE 🌳", title_style))
    story.append(Paragraph("Six Generations of Family History • From German Immigrants to Today", subtitle_style))
    story.append(Paragraph(f"Prepared for Caren & Kyle Dudgeon • {datetime.now().strftime('%B %d, %Y')}", subtitle_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Create family tree visualization
    for gen_name, members in family_generations.items():
        story.append(Paragraph(gen_name, gen_header_style))
        
        # Create table for this generation
        data = []
        for person in members[:4]:  # Limit to 4 per row for readability
            name = person['name']
            dates = f"{person['born']} - {person['died']}" if person['died'] else f"b. {person['born']}"
            spouse = f"♥ {person['spouse']}" if person['spouse'] else ""
            note = person['note']
            
            cell_content = f"""
            <b>{name}</b><br/>
            <font size="8">{dates}</font><br/>
            <font size="7" color="#8B0000">{spouse}</font><br/>
            <font size="7" color="#666666"><i>{note}</i></font>
            """
            data.append(Paragraph(cell_content, person_info_style))
        
        # Pad row if needed
        while len(data) < 4:
            data.append("")
        
        # Create table
        if data:
            t = Table([data], colWidths=[3.5*inch]*4)
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F5F5DC')),
                ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#8B4513')),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#D2B48C')),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ]))
            story.append(t)
            story.append(Spacer(1, 0.1*inch))
    
    # Add footer
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph("— Family is not an important thing. It's everything. — Michael J. Fox —",
                          ParagraphStyle('Quote', parent=styles['Italic'], fontName='Arial', alignment=1, textColor=colors.HexColor('#5D4E37'))))
    
    doc.build(story)
    print(f"✅ PDF created successfully: {filename}")

if __name__ == "__main__":
    output_file = "/Users/ava/.openclaw/workspace/Desmonds_Teders_Family_Tree_Display.pdf"
    create_family_tree_pdf(output_file)
