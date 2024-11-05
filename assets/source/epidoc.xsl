<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="3.0" xmlns:t="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="t">
    
    <xsl:output omit-xml-declaration="yes" indent="yes" method="html"/>
    
    <xsl:template match="/">
        <xsl:for-each select="//t:div[@type='textpart'][t:p]">
            <xsl:variable name="citStrings">
                <xsl:for-each select="ancestor::t:div[@type='textpart']">
                    <xsl:value-of select="@n"/><xsl:text>.</xsl:text>
                </xsl:for-each>
                <xsl:value-of select="@n"/>
            </xsl:variable>
            <xsl:element name="div">
                <xsl:attribute name="class">citation-section</xsl:attribute>
                <xsl:attribute name="n"><xsl:value-of select="$citStrings"/></xsl:attribute>
                <xsl:attribute name="id"><xsl:value-of select="//t:body/t:div/@n"/><xsl:text>;</xsl:text><xsl:value-of select="$citStrings"/></xsl:attribute>
                <xsl:for-each select="./t:p">                
                    <span class="text-paragraph">
                        <xsl:for-each select="node()">
                            <xsl:choose>
                                <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                                <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                            </xsl:choose>
                        </xsl:for-each>
                    </span>
                </xsl:for-each>
            </xsl:element>
        </xsl:for-each>
    </xsl:template>
    
    <!--<xsl:template match="t:div[@type='textpart'][t:p]">
        <xsl:for-each select="node()">
            <xsl:choose>
                <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="t:p">
        <p>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </p>
    </xsl:template>-->
    
    <xsl:template match="t:w">
        <xsl:element name="span">
            <xsl:attribute name="lemma">
                <xsl:value-of select="@lemma"/>
            </xsl:attribute>
            <xsl:attribute name="n">
                <xsl:text>w-</xsl:text><xsl:value-of select="@n"/>
            </xsl:attribute>
            <xsl:value-of select="text()"/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:l">
        <xsl:element name="li">
            <xsl:apply-templates select="@urn" />
            <xsl:attribute name="value"><xsl:value-of select="@n"/></xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:lg">
        <xsl:element name="ol">
            <xsl:apply-templates select="@urn" />
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:ab/text()">
        <xsl:value-of select="." />
    </xsl:template>
    
    <xsl:template match="t:div[@subtype='verse']/t:p">
        <xsl:apply-templates select="@urn" />
        <xsl:for-each select="node()">
            <xsl:choose>
                <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="t:ex">
        <span class="ex">
            <xsl:text>(</xsl:text><xsl:value-of select="." /><xsl:text>)</xsl:text>
        </span>
    </xsl:template>
    
    <xsl:template match="t:abbr">
        <span class="abbr">
            <xsl:value-of select="." />
        </span>
    </xsl:template>  
    
    <xsl:template match="t:gap">
        <span class="gap">
            <xsl:choose>
                <xsl:when test="@quantity and @unit='character'">
                    <xsl:value-of select="string(@quantity)" />
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>-\-\-</xsl:text>
                </xsl:otherwise>
            </xsl:choose>            
        </span>
    </xsl:template>
    
    <xsl:template match="@urn">
        <xsl:attribute name="data-urn"><xsl:value-of select="."/></xsl:attribute>
    </xsl:template>
    
    <xsl:template match="t:sp">
        <section class="speak">
            <xsl:if test="./t:speaker">
                <em><xsl:value-of select="./t:speaker/text()" /></em>
            </xsl:if>
            <xsl:choose>
                <xsl:when test="./t:lg">
                    <xsl:apply-templates select="./t:lg" />
                </xsl:when>
                <xsl:when test="./t:p">
                    <xsl:apply-templates select="./t:p" />
                </xsl:when>
                <xsl:otherwise>
                    <ol>
                        <xsl:apply-templates select="./t:l"/>
                    </ol>
                </xsl:otherwise>
            </xsl:choose>
        </section>
    </xsl:template>
    
    <xsl:template match="t:supplied">
        <span>
            <xsl:attribute name="class">supplied supplied_<xsl:value-of select='@cert' /></xsl:attribute>
            <xsl:text>[</xsl:text>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
            <xsl:if test="@cert = 'low'"><xsl:text>?</xsl:text></xsl:if>
            <xsl:text>]</xsl:text>
        </span>
    </xsl:template>
    
    <xsl:template match="t:choice">
        <span class="choice">
            <xsl:attribute name="title">
                <xsl:value-of select="reg" />
            </xsl:attribute>
            <xsl:value-of select="orig" /><xsl:text> </xsl:text>
        </span>
    </xsl:template>
    
    <xsl:template match="t:unclear">
        <span class="unclear"><xsl:value-of select="." /></span>
    </xsl:template>
    
    <xsl:template match="t:seg[@type='font-style:italic;']" mode="noteSegs">
        <span class="font-italic">
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </span>
    </xsl:template>
    
    <xsl:template match="t:seg[@type='lex-title']">
        <strong>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </strong>
    </xsl:template>
    
    <xsl:template match="t:list">
        <ul class="list-unstyled">
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </ul>
    </xsl:template>
    
    <xsl:template match="t:item">
        <li>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </li>
    </xsl:template>
    
    <xsl:template match="t:note">
    </xsl:template>
    
</xsl:stylesheet>

