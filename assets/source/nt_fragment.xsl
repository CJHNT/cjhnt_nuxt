<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="3.0" xmlns:t="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="t">
    <xsl:output omit-xml-declaration="yes" indent="yes" method="html"/>
    <xsl:template match="/">
                <xsl:for-each select="//t:body">
                    <xsl:for-each select="t:div">
                        <xsl:element name="div">
                            <xsl:for-each select="node()">
                                <xsl:choose>
                                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                                </xsl:choose>
                            </xsl:for-each>
                        </xsl:element>
                    </xsl:for-each>
                </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="t:div[@subtype='chapter']">
        <xsl:if test="descendant::t:w">
        <xsl:for-each select="node()">
            <xsl:choose>
                <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="t:div[@subtype='verse']">
        <xsl:if test="descendant::t:w">
        <xsl:variable name="citStrings">
            <xsl:for-each select="ancestor::t:div[@type='textpart']">
                <xsl:value-of select="@n"/><xsl:text>.</xsl:text>
            </xsl:for-each>
            <xsl:value-of select="@n"/>
        </xsl:variable>
        <xsl:element name="seg">
            <xsl:attribute name="class">citation-section</xsl:attribute>
            <xsl:attribute name="n"><xsl:value-of select="$citStrings"/></xsl:attribute>
            <xsl:attribute name="id"><xsl:value-of select="//t:body/t:div/@n"/><xsl:text>;</xsl:text><xsl:value-of select="$citStrings"/></xsl:attribute>
            <xsl:for-each select="child::t:ab">
                <xsl:element name="span">
                    <xsl:attribute name="class">text-paragraph</xsl:attribute>
                    <xsl:for-each select="node()">
                        <xsl:choose>
                            <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                            <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                        </xsl:choose>
                    </xsl:for-each>
                </xsl:element>
            </xsl:for-each>
        </xsl:element>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="t:div[@type='section-heading']">
        <xsl:element name="div">
            <xsl:attribute name="class">section-subtitle</xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:div[@type='sub-section-heading']">
        <xsl:element name="div">
            <xsl:attribute name="class">subsection-subtitle</xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:div[@type='minor-heading']">
        <xsl:element name="div">
            <xsl:attribute name="class">minor-heading</xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:w[not(@type='phonetic')]">
        <xsl:element name="span">
            <xsl:attribute name="lemma">
                <xsl:value-of select="@lemma"/>
            </xsl:attribute>
            <xsl:attribute name="n">
                <xsl:text>w-</xsl:text><xsl:value-of select="@n"/>
            </xsl:attribute>
            <xsl:attribute name="class">stack</xsl:attribute>
            <xsl:if test="./t:w[@type='phonetic']">
                <xsl:attribute name="phonetic-lemma">
                    <xsl:value-of select="./t:w[@type='phonetic']/@lemma"/>
                </xsl:attribute>
                <xsl:element name="span">
                    <xsl:attribute name="class">phonetic d-none</xsl:attribute>
                    <xsl:value-of select="./t:w[@type='phonetic']/text()"/>
                </xsl:element>
            </xsl:if>
            <xsl:value-of select="text()"/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:lb">
        <xsl:element name="p">
            <xsl:attribute name="class" select="@type"></xsl:attribute>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="l">
        <xsl:element name="blockquote">
            <xsl:attribute name="class">blockquote pb-0 pt-1</xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:seg[@rend='em']">
        <xsl:element name="span">
            <xsl:attribute name="class">font-italic font-weight-bold</xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:seg[@rend]">
        <xsl:element name="span">
            <xsl:attribute name="class" select="@rend"></xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:span[@rend='mx-auto']">
        <xsl:element name="span">
            <xsl:attribute name="class">mx-auto</xsl:attribute>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:note">
        
    </xsl:template>
</xsl:stylesheet>