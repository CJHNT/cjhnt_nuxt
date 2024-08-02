<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:t="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="t">
    
    <xsl:output omit-xml-declaration="yes" indent="yes" method="html"/>
    
    <xsl:template match="t:div[@type='commentary']">
        <xsl:copy-of select="."/>
    </xsl:template>
    <xsl:template match="/">
        <div>
            <xsl:apply-templates select="//t:div[@type='commentary']" />
        </div>
    </xsl:template>
</xsl:stylesheet>