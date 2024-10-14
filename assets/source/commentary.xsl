<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0" xmlns:t="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="t">
    
    <xsl:output omit-xml-declaration="yes" indent="yes" method="html"/>
    
    <xsl:template match="/">
        <xsl:for-each select="//t:text/t:body/t:div/t:div/t:div[@type='lang-div']">
            <xsl:variable name="langtag" select="@subtype"/>
            <xsl:element name="div">     
                <xsl:attribute name="xml:space">preserve</xsl:attribute>
                <xsl:attribute name="lang"><xsl:value-of select="$langtag"/></xsl:attribute>
                <xsl:attribute name="id"><xsl:value-of select="$langtag"/>-text</xsl:attribute>
                <xsl:element name="h1">
                    <xsl:attribute name="lang"><xsl:value-of select="$langtag"/></xsl:attribute>
                    <xsl:value-of select="/t:TEI/t:teiHeader/t:fileDesc/t:titleStmt/t:title[@n=$langtag]"/>
                </xsl:element>
                <xsl:apply-templates select="//t:text/t:body/t:div/t:div[@source]"></xsl:apply-templates>
                <xsl:apply-templates select="//t:text/t:body/t:div/t:div/t:div[@subtype=$langtag]/t:head[@type='cjh-Überschrift-1']"></xsl:apply-templates>
                <xsl:apply-templates select="//t:text/t:body/t:div/t:div/t:div[@subtype=$langtag]/t:head[@type='cjh-Überschrift-2']"></xsl:apply-templates>
                <xsl:apply-templates select="//t:text/t:body/t:div/t:div/t:div[@subtype=$langtag]/t:div"></xsl:apply-templates>
            </xsl:element>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="//t:text/t:body/t:div/t:div[@source]">
        <xsl:element name="seg">
            <xsl:attribute name="class">nt-source-text</xsl:attribute>
            <xsl:attribute name="source-text"><xsl:value-of select="substring-before(@source, ';')"/></xsl:attribute>
            <xsl:attribute name="source-verse"><xsl:value-of select="substring-before(substring-after(@source, ';'), ';')"/></xsl:attribute>
            <xsl:attribute name="source-words"><xsl:value-of select="substring-after(substring-after(@source, ';'), ';')"/></xsl:attribute>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:head[@type='cjh-Überschrift-1']">
        <xsl:element name="h2">
            <xsl:attribute name="class"><xsl:value-of select="@type"/></xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:head[@type='cjh-Überschrift-2']">
        <xsl:element name="h3">
            <xsl:attribute name="class"><xsl:value-of select="@type"/></xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:div[@type='sectionA']">
        <xsl:if test="t:p/node()">
            <xsl:choose>
                <xsl:when test="ancestor::div[@type='lang-div' and @subtype='en']">
                    <xsl:element name="h3"><xsl:attribute name="class">section-subtitle</xsl:attribute>Literature</xsl:element>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:element name="h3"><xsl:attribute name="class">section-subtitle</xsl:attribute>Literatur</xsl:element>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:element name="div">
                <xsl:attribute name="class"><xsl:value-of select="@type"/></xsl:attribute>
                <xsl:for-each select="t:p">
                    <xsl:apply-templates select="."></xsl:apply-templates>
                </xsl:for-each>
            </xsl:element>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="t:div[@type='sectionB']">
        <xsl:if test="t:p/node()">
            <xsl:choose>
                <xsl:when test="ancestor::div[@type='lang-div' and @subtype='en']">
                    <xsl:element name="h3"><xsl:attribute name="class">section-subtitle</xsl:attribute>Primary Sources</xsl:element>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:element name="h3"><xsl:attribute name="class">section-subtitle</xsl:attribute>Belegstellenübersicht</xsl:element>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:element name="div">
                <xsl:attribute name="type"><xsl:value-of select="@type"/></xsl:attribute>
                <xsl:for-each select="t:p">
                    <xsl:apply-templates select="."></xsl:apply-templates>
                </xsl:for-each>
            </xsl:element>
            <xsl:element name="div">
                <xsl:attribute name="class">section-b-dropdown-content border-md rounded border-opacity-0 pa-2</xsl:attribute>
                <xsl:attribute name="id">section-b-dropdown-content</xsl:attribute>
                <div class="tab d-flex justify-space-evenly">
                    Loading...
                </div>
                
                <!-- Tab content -->
                <div id="belegstelle-content" class="tabcontent">
                    Loading...
                </div>
            </xsl:element>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="t:div[@type='sectionC']">
        <xsl:if test="t:p/node()">
            <xsl:choose>
                <xsl:when test="ancestor::div[@type='lang-div' and @subtype='en']">
                    <xsl:element name="h3"><xsl:attribute name="class">section-subtitle</xsl:attribute>Rationale for Chosen Sources</xsl:element>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:element name="h3"><xsl:attribute name="class">section-subtitle</xsl:attribute>Begründung der Textauswahl</xsl:element>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:element name="div">
                <xsl:attribute name="type"><xsl:value-of select="@type"/></xsl:attribute>
                <xsl:for-each select="t:p">
                    <xsl:apply-templates select="."></xsl:apply-templates>
                </xsl:for-each>
            </xsl:element>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="t:div[@type='sectionD']">
        <xsl:if test="t:div[@type='beleg-gruppe']/node()">
            <xsl:choose>
                <xsl:when test="t:head[@type='cjh-Überschrift-3D']/node()"> 
                    <xsl:element name="h3">
                        <xsl:for-each select="t:head[@type='cjh-Überschrift-3D']/node()">
                            <xsl:apply-templates select="."></xsl:apply-templates>
                        </xsl:for-each>
                    </xsl:element>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:choose>
                        <xsl:when test="ancestor::div[@type='lang-div' and @subtype='en']">
                            <xsl:element name="h3"><xsl:attribute name="class">section-subtitle</xsl:attribute>Texts</xsl:element>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:element name="h3"><xsl:attribute name="class">section-subtitle</xsl:attribute>Texte</xsl:element>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:element name="div">
                <xsl:attribute name="type"><xsl:value-of select="@type"/></xsl:attribute>
                <xsl:for-each select="t:div">
                    <xsl:apply-templates select="."></xsl:apply-templates>
                </xsl:for-each>
            </xsl:element>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="t:div[@type='sectionE']">
        <xsl:if test="t:p/node()">
            <xsl:choose>
                <xsl:when test="ancestor::div[@type='lang-div' and @subtype='en']">
                    <xsl:element name="h3"><xsl:attribute name="class">section-subtitle</xsl:attribute>Summary and Additional Information</xsl:element>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:element name="h3"><xsl:attribute name="class">section-subtitle</xsl:attribute>Zusammenfassende Auswertung und weiterführende Hinweise</xsl:element>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:element name="div">
                <xsl:attribute name="type"><xsl:value-of select="@type"/></xsl:attribute>
                <xsl:for-each select="t:p">
                    <xsl:apply-templates select="."></xsl:apply-templates>
                </xsl:for-each>
            </xsl:element>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="t:div[@type='beleg-gruppe']">
        <xsl:variable name="prev-styles" select="count(preceding::t:div[@type='beleg-gruppe'])"/>
        <xsl:variable name="group-id" select="generate-id(.)"/>
        <xsl:element name="div">
            <xsl:attribute name="class">beleg-gruppe my-2</xsl:attribute>
            <xsl:element name="button">
                <xsl:attribute name="data-target"><xsl:value-of select="$group-id"/></xsl:attribute>
                <xsl:attribute name="class">section-d-dropdown-button</xsl:attribute>
                <xsl:attribute name="aria-expanded">false</xsl:attribute>
                <xsl:attribute name="aria-controls"><xsl:value-of select="$group-id"/></xsl:attribute>
                <xsl:element name="span">
                    <xsl:attribute name="class">dropdown-button-text closed</xsl:attribute>
                    <xsl:for-each select="./t:head[@type='cjh-Überschrift-3']/node()">
                        <xsl:choose>
                            <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                            <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                        </xsl:choose>
                    </xsl:for-each>
                    <xsl:element name="span">
                        <xsl:attribute name="id"><xsl:value-of select="$group-id"/>-chevron</xsl:attribute>
                        <xsl:attribute name="class">mdi-chevron-down mdi</xsl:attribute>
                    </xsl:element>
                </xsl:element>
            </xsl:element>
            <xsl:element name="div">
                <xsl:attribute name="class">section-d-dropdown-content border-md rounded border-opacity-0 pa-2</xsl:attribute>
                <xsl:attribute name="id"><xsl:value-of select="$group-id"/></xsl:attribute>
                <xsl:for-each select="t:div">
                    <xsl:apply-templates select="."></xsl:apply-templates>
                </xsl:for-each>
            </xsl:element>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:div[@type='beleg-subgruppe']">
        <xsl:variable name="prev-styles" select="count(preceding::t:div[@type='beleg-subgruppe'])"/>
        <xsl:element name="h4">
            <xsl:for-each select="./t:head[@type='cjh-Überschrift-4']/node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
        <xsl:element name="div">
            <xsl:for-each select="t:div">
                <xsl:apply-templates select="."></xsl:apply-templates>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:div[@type='cjh-Petit']">
        <xsl:element name="div">
            <xsl:attribute name="source"><xsl:value-of select="@source"/></xsl:attribute>
            <xsl:attribute name="class">text-caption</xsl:attribute>
            <xsl:attribute name="id"><xsl:value-of select="@n"/></xsl:attribute>
            <xsl:element name="h5"><xsl:value-of select="@source"/></xsl:element>
            <xsl:for-each select="t:p">
                <xsl:apply-templates select="."></xsl:apply-templates>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:div[@type='texteinleitung']">
        <xsl:element name="div">
            <xsl:attribute name="source"><xsl:value-of select="@source"/></xsl:attribute>
            <xsl:attribute name="class">texteinleitung</xsl:attribute>
            <xsl:attribute name="id"><xsl:value-of select="@n"/></xsl:attribute>
            <xsl:element name="h5"><xsl:value-of select="@source"/></xsl:element>
            <xsl:for-each select="t:p">
                <xsl:apply-templates select="."></xsl:apply-templates>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:div[contains(@type, 'cjh-Zitat')]">
        <xsl:variable name="currentType" select="@type"/>
        <xsl:choose>
            <xsl:when test="@type='cjh-ZitatÜbersetzung' and not(preceding-sibling::t:div[@type='cjh-ZitatÜbersetzung'])">
                <xsl:element name="h6">Übersetzung</xsl:element>
            </xsl:when>
            <xsl:when test="@type='cjh-ZitatTranskription' and not(preceding-sibling::t:div[@type='cjh-ZitatTranskription'])">
                <xsl:element name="h6">Transkription</xsl:element>
            </xsl:when>
            <xsl:when test="@type='cjh-Zitaterläuterung' and not(preceding-sibling::t:div[@type='cjh-Zitaterläuterung'])">
                <xsl:element name="h6">Erläuterung</xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:if test="@source">
                    <xsl:element name="h5"><xsl:value-of select="@source"/></xsl:element>
                </xsl:if>
                <xsl:if test="not(preceding-sibling::t:div[@type=$currentType])"><xsl:element name="h6">Original</xsl:element></xsl:if>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:element name="div">
            <xsl:attribute name="source"><xsl:value-of select="@source"/></xsl:attribute>
            <xsl:attribute name="class"><xsl:value-of select="@type"/></xsl:attribute>
            <xsl:for-each select="t:p">
                <xsl:choose>
                    <xsl:when test="$currentType = 'cjh-ZitatHebr'">
                        <xsl:attribute name="lang">heb</xsl:attribute>
                        <xsl:attribute name="dir">rtl</xsl:attribute>
                    </xsl:when>
                    <xsl:when test="$currentType = 'cjh-ZitatSyr'">
                        <xsl:attribute name="lang">syr</xsl:attribute>
                        <xsl:attribute name="dir">rtl</xsl:attribute>
                    </xsl:when>
                    <xsl:when test="$currentType = 'cjh-ZitatArab'">
                        <xsl:attribute name="lang">ara</xsl:attribute>
                        <xsl:attribute name="dir">rtl</xsl:attribute>
                    </xsl:when>
                </xsl:choose>
                <xsl:apply-templates select="."></xsl:apply-templates>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:seg[@type='beleg-section']">
        <xsl:if test="preceding-sibling::*">            
            <xsl:element name="br"></xsl:element>
        </xsl:if>
        <xsl:element name="b">
            <xsl:attribute name="class">beleg-section-name</xsl:attribute>
            <xsl:value-of select="@n"/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:ref[@type='belegstelle-erläutert']">
        <xsl:element name="a">
            <xsl:choose>
                <xsl:when test="preceding-sibling::node()[1][self::text()] and ends-with(preceding-sibling::node()[1], ' ')">
                    <xsl:attribute name="class">belegstelle-erläutert space-before</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="class">belegstelle-erläutert</xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:attribute name="href">#</xsl:attribute>
            <xsl:attribute name="data-target"><xsl:value-of select="@target"/></xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:seg[@type='belegstelle']">
        <xsl:choose>
            <xsl:when test="ancestor::t:div[@type='sectionB']">
                <xsl:element name="button">
                    <xsl:choose>
                        <xsl:when test="preceding-sibling::node()[1][self::text()] and ends-with(preceding-sibling::node()[1], ' ')">
                            <xsl:attribute name="class">belegstelle-button btn btn-link space-before</xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="class">belegstelle-button btn btn-link</xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:attribute name="aria-expanded">false</xsl:attribute>
                    <xsl:attribute name="source-verse">
                        <xsl:value-of select="substring-after(@source, ';')"/>
                    </xsl:attribute>
                    <xsl:attribute name="source-text">
                        <xsl:value-of select="substring-before(@source, ';')"/>
                    </xsl:attribute>
                    <xsl:attribute name="id"><xsl:value-of select="generate-id(.)"/></xsl:attribute>
                    <xsl:attribute name="data-target">#section-b-dropdown-content</xsl:attribute>
                    <xsl:attribute name="aria-controls">section-b-dropdown-content</xsl:attribute>
                    <xsl:element name="span">
                        <xsl:attribute name="class">dropdown-button-text closed</xsl:attribute>
                        <xsl:for-each select="node()">
                            <xsl:choose>
                                <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                                <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                            </xsl:choose>
                        </xsl:for-each>
                        <xsl:element name="span">
                            <xsl:attribute name="id"><xsl:value-of select="generate-id(.)"/>-chevron</xsl:attribute>
                            <xsl:attribute name="class">mdi-chevron-down mdi</xsl:attribute>
                        </xsl:element>
                    </xsl:element>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:element name="span">
                    <xsl:choose>
                        <xsl:when test="preceding-sibling::node()[1][self::text()] and ends-with(preceding-sibling::node()[1], ' ')">
                            <xsl:attribute name="class">font-weight-bold space-before</xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="class">font-weight-bold</xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:for-each select="node()">
                        <xsl:choose>
                            <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                            <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                        </xsl:choose>
                    </xsl:for-each>
                </xsl:element>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="t:seg[@type='cjh-Griechisch']">
        <xsl:for-each select="node()">
            <xsl:choose>
                <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="t:seg[@type='cjh-Autorennamen']">
        <xsl:element name="seg">
            <xsl:attribute name="class">cjh-Autorennamen</xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:seg[@type='italic']">
        <xsl:element name="span">
            <xsl:choose>
                <xsl:when test="preceding-sibling::node()[1][self::text()] and ends-with(preceding-sibling::node()[1], ' ')">
                    <xsl:attribute name="class">font-italic font-weight-bold space-before</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="class">font-italic font-weight-bold</xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:ref[@type='erläuterungPointer']">
        <xsl:element name="sup">
            <xsl:attribute name="target"><xsl:value-of select="@target"/></xsl:attribute>
            <xsl:attribute name="class" select="@type"></xsl:attribute>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:note[@type='zitatErläuterung']">
        <xsl:element name="seg">
            <xsl:attribute name="id"><xsl:value-of select="n"/></xsl:attribute>
            <xsl:element name="sup"><xsl:value-of select="@n"/></xsl:element>
        </xsl:element>
        <xsl:for-each select="node()">
            <xsl:choose>
                <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="t:p[not(@n='source-text')]">
        <xsl:element name="p">
            <xsl:apply-templates select="@urn" />
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:p[contains(@n, 'source-text')]">
        <xsl:apply-templates select="@urn" />
        <xsl:for-each select="node()">
            <xsl:choose>
                <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="t:w[not(parent::t:seg[@type='cjh-Griechisch'])]">
        <xsl:element name="span">
            <xsl:choose>
                <xsl:when test="preceding-sibling::node()[1][self::text()] and ends-with(preceding-sibling::node()[1], ' ')">
                    <xsl:attribute name="class">w space-before</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="class">w</xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:value-of select="."/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:seg[@type='cjh-Griechisch']">
        <xsl:element name="span">
            <xsl:choose>
                <xsl:when test="preceding-sibling::node()[1][self::text()] and ends-with(preceding-sibling::node()[1], ' ')">
                    <xsl:attribute name="class">greek space-before</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="class">greek</xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:when test="self::t:w">
                        <xsl:element name="span">
                            <xsl:choose>
                                <xsl:when test="preceding-sibling::node()[1][self::text()] and ends-with(preceding-sibling::node()[1], ' ')">
                                    <xsl:attribute name="class">w space-before</xsl:attribute>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:attribute name="class">w</xsl:attribute>
                                </xsl:otherwise>
                            </xsl:choose>
                            <xsl:value-of select="."/>
                        </xsl:element>
                    </xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:seg[@type='superscript']">
        <xsl:element name="sup">
            <xsl:choose>
                <xsl:when test="following-sibling::node()[1][self::text()] and starts-with(following-sibling::node()[1], ' ') and preceding-sibling::node()[1][self::text()] and ends-with(preceding-sibling::node()[1], ' ')">
                    <xsl:attribute name="class">space-after space-before</xsl:attribute>
                </xsl:when>
                <xsl:when test="following-sibling::node()[1][self::text()] and starts-with(following-sibling::node()[1], ' ')">
                    <xsl:attribute name="class">space-after</xsl:attribute>
                </xsl:when>
                <xsl:when test="preceding-sibling::node()[1][self::text()] and ends-with(preceding-sibling::node()[1], ' ')">
                    <xsl:attribute name="class">space-before</xsl:attribute>
                </xsl:when>
            </xsl:choose>
            <xsl:for-each select="node()">
                <xsl:choose>
                    <xsl:when test="self::text()"><xsl:value-of select="."/></xsl:when>
                    <xsl:otherwise><xsl:apply-templates select="."></xsl:apply-templates></xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:teiHeader"></xsl:template>
    
</xsl:stylesheet>

