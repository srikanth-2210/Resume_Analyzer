from io import BytesIO
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    PageBreak, Image
)
from reportlab.lib.colors import HexColor, black, lightgrey, grey
greyish = grey  # alias for consistent naming
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class PDFReportService:
    def __init__(self):
        self.primary_color = HexColor('#2c3e50')
        self.secondary_color = HexColor('#3498db')
        self.accent_color = HexColor('#1abc9c')
        self.danger_color = HexColor('#e74c3c')
        self.success_color = HexColor('#27ae60')
        self.warning_color = HexColor('#f39c12')
    
    def generate_report(self, analysis_data: dict) -> BytesIO:
        """Generate comprehensive PDF report from analysis data."""
        try:
            buffer = BytesIO()
            doc = SimpleDocTemplate(
                buffer, 
                pagesize=letter, 
                rightMargin=0.5*inch, 
                leftMargin=0.5*inch, 
                topMargin=0.5*inch, 
                bottomMargin=0.5*inch
            )
            
            styles = self._create_styles()
            story = []
            
            # Add pages
            story.extend(self._create_header_section(styles))
            story.append(Spacer(1, 0.3*inch))
            
            story.extend(self._create_score_summary_section(analysis_data, styles))
            story.append(Spacer(1, 0.2*inch))
            
            story.extend(self._create_executive_summary_section(analysis_data, styles))
            story.append(PageBreak())
            
            story.extend(self._create_skills_analysis_section(analysis_data, styles))
            story.append(Spacer(1, 0.2*inch))
            
            story.extend(self._create_skill_comparison_section(analysis_data, styles))
            story.append(PageBreak())
            
            story.extend(self._create_ats_section(analysis_data, styles))
            story.append(Spacer(1, 0.2*inch))
            
            story.extend(self._create_recommendations_section(analysis_data, styles))
            story.append(Spacer(1, 0.3*inch))
            
            story.extend(self._create_footer_section(styles))
            
            # Build PDF
            doc.build(story)
            buffer.seek(0)
            return buffer
            
        except Exception as e:
            logger.error(f"Error generating PDF report: {e}")
            raise
    
    def _create_styles(self) -> dict:
        """Create custom text styles for the report."""
        styles = getSampleStyleSheet()
        
        # Title styles
        styles.add(ParagraphStyle(
            name='ReportTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=self.primary_color,
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Section heading styles
        styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=self.secondary_color,
            spaceAfter=10,
            spaceBefore=10,
            borderColor=self.secondary_color,
            borderWidth=2,
            borderPadding=8,
            fontName='Helvetica-Bold'
        ))
        
        # Subsection style
        styles.add(ParagraphStyle(
            name='Subsection',
            parent=styles['Heading3'],
            fontSize=11,
            textColor=self.primary_color,
            spaceAfter=6,
            fontName='Helvetica-Bold'
        ))
        
        # Body text
        styles.add(ParagraphStyle(
            name='BodyText',
            parent=styles['Normal'],
            fontSize=10,
            textColor=black,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
            leading=14
        ))
        
        # Small text for details
        styles.add(ParagraphStyle(
            name='SmallText',
            parent=styles['Normal'],
            fontSize=9,
            textColor=HexColor('#7f8c8d'),
            spaceAfter=4
        ))
        
        return styles
    
    def _create_header_section(self, styles: dict) -> list:
        """Create report header with title and metadata."""
        content = []
        
        content.append(Paragraph("AI Resume Intelligence Report", styles['ReportTitle']))
        content.append(Spacer(1, 6))
        
        timestamp = datetime.now().strftime("%B %d, %Y at %H:%M")
        content.append(Paragraph(
            f"<i>Generated on {timestamp}</i>",
            styles['SmallText']
        ))
        
        return content
    
    def _create_score_summary_section(self, analysis_data: dict, styles: dict) -> list:
        """Create comprehensive score summary table."""
        content = []
        
        content.append(Paragraph("Score Summary", styles['SectionHeader']))
        
        # Extract scores
        match_score = analysis_data.get("match_score", 0)
        ats_score = analysis_data.get("ats_score", 0)
        skills_score = analysis_data.get("skills_score", match_score)
        experience_score = analysis_data.get("experience_score", match_score)
        readability_score = analysis_data.get("readability_score", ats_score)
        
        # Create score table
        score_data = [
            ["Metric", "Score", "Status"],
            ["Overall Match", f"{match_score}%", self._get_status_badge(match_score)],
            ["Skills Match", f"{skills_score}%", self._get_status_badge(skills_score)],
            ["Experience Match", f"{experience_score}%", self._get_status_badge(experience_score)],
            ["ATS Compatibility", f"{ats_score}%", self._get_status_badge(ats_score)],
            ["Readability", f"{readability_score}%", self._get_status_badge(readability_score)]
        ]
        
        score_table = Table(score_data, colWidths=[2.5*inch, 1.5*inch, 1.5*inch])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), self.secondary_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), 'white'),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('GRID', (0, 0), (-1, -1), 1, black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [lightgrey, 'white']),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ROWHEIGHT', (0, 0), (-1, -1), 25)
        ]))
        
        content.append(score_table)
        
        return content
    
    def _create_executive_summary_section(self, analysis_data: dict, styles: dict) -> list:
        """Create executive summary section."""
        content = []
        
        content.append(Paragraph("Executive Summary", styles['SectionHeader']))
        
        summary = analysis_data.get("summary", "")
        if summary:
            content.append(Paragraph(summary, styles['BodyText']))
        
        # Add insights
        readiness = analysis_data.get("readiness", {})
        if readiness:
            content.append(Spacer(1, 8))
            content.append(Paragraph("<b>Production Readiness:</b>", styles['Subsection']))
            content.append(Paragraph(
                f"Tools & Technology Score: {readiness.get('readiness_score', 0)}%",
                styles['BodyText']
            ))
            
            tools = readiness.get("found_tools", [])
            if tools:
                tools_text = ", ".join(tools[:10])
                if len(tools) > 10:
                    tools_text += f", and {len(tools)-10} more..."
                content.append(Paragraph(f"<b>Key Tools Found:</b> {tools_text}", styles['BodyText']))
        
        return content
    
    def _create_skills_analysis_section(self, analysis_data: dict, styles: dict) -> list:
        """Create detailed skills analysis section."""
        content = []
        
        content.append(Paragraph("Skills Analysis", styles['SectionHeader']))
        
        # Strong matches
        strengths = analysis_data.get("strengths", [])
        if strengths:
            content.append(Paragraph("<b>Strong Matches:</b>", styles['Subsection']))
            skills_text = ", ".join(strengths[:15])
            if len(strengths) > 15:
                skills_text += f", and {len(strengths)-15} more..."
            content.append(Paragraph(skills_text, styles['BodyText']))
            content.append(Spacer(1, 6))
        
        # Partial matches
        skill_comp = analysis_data.get("skill_comparison", [])
        partial_matches = [s["skill"] for s in skill_comp if s.get("status") == "Partial Match"]
        if partial_matches:
            content.append(Paragraph("<b>Partial Matches:</b>", styles['Subsection']))
            partial_text = ", ".join(partial_matches[:10])
            if len(partial_matches) > 10:
                partial_text += f", and {len(partial_matches)-10} more..."
            content.append(Paragraph(partial_text, styles['BodyText']))
            content.append(Spacer(1, 6))
        
        # Missing skills ranked by importance
        gap_ranking = analysis_data.get("skill_gap_ranking", [])
        if gap_ranking:
            content.append(Paragraph("<b>Priority Skill Gaps:</b>", styles['Subsection']))
            
            gap_data = [["Skill", "Importance", "Impact"]]
            for gap in gap_ranking[:8]:
                skill = gap.get("skill", "N/A")
                importance = gap.get("importance", "medium").upper()
                reason = gap.get("reason", "")[:60] + "..." if len(gap.get("reason", "")) > 60 else gap.get("reason", "")
                gap_data.append([skill, importance, reason])
            
            if len(gap_data) > 1:
                gap_table = Table(gap_data, colWidths=[2*inch, 1.2*inch, 1.8*inch])
                gap_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), self.warning_color),
                    ('TEXTCOLOR', (0, 0), (-1, 0), 'white'),
                    ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                    ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 10),
                    ('GRID', (0, 0), (-1, -1), 0.5, grey),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [lightgrey, 'white']),
                    ('FONTSIZE', (0, 1), (-1, -1), 8),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('ROWHEIGHT', (0, 0), (-1, -1), 20)
                ]))
                content.append(gap_table)
        
        return content
    
    def _create_skill_comparison_section(self, analysis_data: dict, styles: dict) -> list:
        """Create skill comparison matrix."""
        content = []
        
        content.append(Paragraph("Skill Comparison Matrix", styles['SectionHeader']))
        
        skill_comparison = analysis_data.get("skill_comparison", [])
        
        if skill_comparison:
            comp_data = [["Skill", "Status"]]
            
            for skill_item in skill_comparison[:20]:
                skill = skill_item.get("skill", "Unknown")
                status = skill_item.get("status", "Missing")
                comp_data.append([skill, status])
            
            comp_table = Table(comp_data, colWidths=[4*inch, 1.5*inch])
            comp_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), self.secondary_color),
                ('TEXTCOLOR', (0, 0), (-1, 0), 'white'),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('GRID', (0, 0), (-1, -1), 0.5, grey),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [lightgrey, 'white']),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('ROWHEIGHT', (0, 0), (-1, -1), 18)
            ]))
            content.append(comp_table)
            
            if len(skill_comparison) > 20:
                content.append(Spacer(1, 6))
                content.append(Paragraph(
                    f"<i>... and {len(skill_comparison)-20} more skills</i>",
                    styles['SmallText']
                ))
        
        return content
    
    def _create_ats_section(self, analysis_data: dict, styles: dict) -> list:
        """Create ATS compatibility section."""
        content = []
        
        content.append(Paragraph("ATS & Formatting Assessment", styles['SectionHeader']))
        
        ats_metrics = analysis_data.get("readiness", {}).get("details", {}) or {}
        
        content.append(Paragraph(
            f"<b>ATS Score:</b> {analysis_data.get('ats_score', 0)}%",
            styles['BodyText']
        ))
        
        content.append(Paragraph(
            f"<b>Readability Score:</b> {analysis_data.get('readability_score', 0)}%",
            styles['BodyText']
        ))
        
        issues = analysis_data.get("readiness", {}).get("recommendations", [])
        if issues:
            content.append(Spacer(1, 8))
            content.append(Paragraph("<b>Recommendations:</b>", styles['Subsection']))
            for issue in issues:
                content.append(Paragraph(f"• {issue}", styles['BodyText']))
        
        return content
    
    def _create_recommendations_section(self, analysis_data: dict, styles: dict) -> list:
        """Create improvement recommendations section."""
        content = []
        
        content.append(Paragraph("Improvement Roadmap", styles['SectionHeader']))
        
        selection_intel = analysis_data.get("selection_intelligence", {})
        
        # Priority action plan
        action_plan = selection_intel.get("priority_action_plan", [])
        if action_plan:
            content.append(Paragraph("<b>Priority Actions:</b>", styles['Subsection']))
            for i, action in enumerate(action_plan[:5], 1):
                content.append(Paragraph(f"{i}. {action}", styles['BodyText']))
            content.append(Spacer(1, 8))
        
        # Optimization suggestions
        opt_bullets = analysis_data.get("optimized_bullets", [])
        if opt_bullets:
            content.append(Paragraph("<b>Optimized Bullet Points:</b>", styles['Subsection']))
            for bullet in opt_bullets[:5]:
                content.append(Paragraph(f"• {bullet}", styles['BodyText']))
        
        # Structural suggestions
        structural = analysis_data.get("structural_suggestions", [])
        if structural:
            content.append(Spacer(1, 8))
            content.append(Paragraph("<b>Structural Suggestions:</b>", styles['Subsection']))
            for sugg in structural[:3]:
                content.append(Paragraph(f"• {sugg}", styles['BodyText']))
        
        return content
    
    def _create_footer_section(self, styles: dict) -> list:
        """Create report footer."""
        content = []
        
        content.append(Paragraph(
            "<b>About This Report</b>",
            styles['Subsection']
        ))
        
        content.append(Paragraph(
            "This AI Resume Intelligence Report is generated using advanced NLP analysis and "
            "semantic matching. It combines machine learning insights with human-centered career "
            "advice to help optimize your resume and application strategy. Use these recommendations "
            "as a guide to enhance your candidacy.",
            styles['SmallText']
        ))
        
        content.append(Spacer(1, 12))
        
        content.append(Paragraph(
            "For more information and career resources, visit the AI Resume Intelligence Platform.",
            styles['SmallText']
        ))
        
        return content
    
    def _get_status_badge(self, score: float) -> str:
        """Get status badge based on score."""
        if score >= 85:
            return "✓ Excellent"
        elif score >= 70:
            return "◐ Good"
        elif score >= 50:
            return "◑ Fair"
        else:
            return "✗ Needs Work"
