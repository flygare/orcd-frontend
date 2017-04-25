import * as d3 from './lib/d3.min';
import * as topojson from './lib/topojson.v2.min.js';

export default class D3map {
    constructor (ctrl, container, onReadyCallback) {
        this.ctrl = ctrl;
        this.container = container;
        this.readyCallback = onReadyCallback;
        this.colorScale = null;
        this.debug = false;
        this.strokeColors = ['#7EB26D', '#EAB839', '#6ED0E0', '#EF843C', '#E24D42', '#1F78C1', '#BA43A9', '#705DA0', '#508642', '#CCA300', '#447EBC', '#C15C17', '#890F02', '#0A437C', '#6D1F62', '#584477', '#B7DBAB', '#F4D598',
        '#70DBED', '#F9BA8F', '#F29191', '#82B5D8', '#E5A8E2', '#AEA2E0', '#629E51', '#E5AC0E', '#64B0C8', '#E0752D', '#BF1B00', '#0A50A1', '#962D82', '#614D93', '#9AC48A', '#F2C96D', '#65C5DB', '#F9934E', '#EA6460', '#5195CE',
        '#D683CE', '#806EB7', '#3F6833', '#967302', '#2F575E', '#99440A', '#58140C', '#052B51', '#511749', '#3F2B5B', '#E0F9D7', '#FCEACA', '#CFFAFF', '#F9E2D2', '#FCE2DE', '#BADFF4', '#F9D9F9', '#DEDAF7'];
        this.currentColorIndex = 0;
        this.createMap();
    }

    createMap () {
        this.colorScale = d3.scaleLinear()
        .domain([0, 100])
        .range([this.ctrl.lightTheme ? '#f5f5f3' : '#151515', '#6699cc']);

        var self = this;
        var width = $('#map').width();
        var height = width / 1.5;

        var projection = d3.geoMercator()
        .scale(width / 395 * 60)
        .translate([width / 2, height / 1.5]);

        var path = d3.geoPath()
        .projection(projection);

        var svg = d3.select('#map').append('svg')
        .attr('preserveAspectRatio', 'xMidYMid')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('width', '100%')
        .attr('height', width * height / width);

        svg.append('rect')
        .attr('class', 'background')
        .attr('width', width)
        .attr('height', height)
        .on('click', (d) => {
            countryClicked();
        });

        // Define the div for the tooltip
        let tooltip = d3.select('body').append('g')
        .attr('class', 'd3tooltip')
        .style('opacity', 0);

        var g = svg.append('g');
        d3.json('public/plugins/qvantel-geomap-panel/data/countries.json', function (world) {
            g.append('g')
            .attr('id', 'countries')
            .selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('id', function (d) { return d.id; })
            .attr('fill', function (d) {
                return self.colorScale(self.getCountryPercentage(d.id));
            })
            .attr('d', path)
            .on('click', (d) => {
                countryClicked(d);
            })
            .on('mouseover', function (d) {
                tooltip.transition()
                .duration(200)
                .style('opacity', 1);

                var data = self.ctrl.data[d.id.toLowerCase()];
                var html = '<div class = \'d3tooltip-title\'>' + self.ctrl.locations.countries[d.id.toUpperCase()].name + '</div>';
                html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Percent: </div><div class = \'d3tooltip-right\'>' + Math.ceil(self.getCountryPercentage(d.id)) + '%</div><div class = \'d3tooltip-clear\'></div></div>';
                html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Current: </div><div class = \'d3tooltip-right\'>' + data.cur + '</div><div class = \'d3tooltip-clear\'></div></div>';
                html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Min: </div><div class = \'d3tooltip-right\'>' + data.min + '</div><div class = \'d3tooltip-clear\'></div></div>';
                html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Max: </div><div class = \'d3tooltip-right\'>' + data.max + '</div><div class = \'d3tooltip-clear\'></div></div>';
                html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Trend: </div><div class = \'d3tooltip-right\'>' + data.trend + '%</div><div class = \'d3tooltip-clear\'></div></div>';
                tooltip.html(html);
            })
            .on('mousemove', function (d) {
                tooltip.style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY) + 'px');
            })
            .on('mouseout', function (d) {
                tooltip.transition()
                .duration(200)
                .style('opacity', 0);
            })
            self.updateStrokeColor();
        });

        var legendWidth = width * 0.4;
        var legendHeight = 10;
        var gradient = svg.append('defs')
          .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%')
            .attr('spreadMethod', 'pad');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', this.colorScale(0))
            .attr('stop-opacity', 1);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', this.colorScale(100))
            .attr('stop-opacity', 1);

        svg.append('rect')
            .attr('x', 20)
            .attr('y', height - 2 * legendHeight)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#gradient)');

        function getXyz (d) {
            let bounds = path.bounds(d);
            let wScale = (bounds[1][0] - bounds[0][0]) / width;
            let hScale = (bounds[1][1] - bounds[0][1]) / height;
            let z = 0.96 / Math.max(wScale, hScale);
            let x = (bounds[1][0] + bounds[0][0]) / 2;
            let y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
            if (z > 3) {
                z = 3
            }
            return [x, y, z];
        }

        function zoom (xyz) {
            g.transition()
            .duration(1500)
            .attr('transform', 'translate(' + projection.translate() + ')scale(' + xyz[2] + ')translate(-' + xyz[0] + ',-' + xyz[1] + ')')
            .selectAll(['#countries'])
            .attr('d', path.pointRadius(20.0 / xyz[2]));
        }

        function countryClicked (d, debug) {
            if (self.ctrl.inputHandler.isCtrlDown() || self.ctrl.inputHandler.isShiftDown() || debug) {
                self.ctrl.selectedCountriesHandler.onCountryClicked(d.id);
            } else if (self.ctrl.panel.clickToZoomEnabled) {
                if (typeof d !== 'undefined' && self.country !== d) {
                    let xyz = getXyz(d);
                    self.country = d;
                    zoom(xyz);
                } else {
                    let xyz = [width / 2, height / 1.5, 1];
                    self.country = null;
                    zoom(xyz);
                }
            }
        }

        if (this.debug) {
            d3.json('public/plugins/qvantel-geomap-panel/data/countries.json', function (world) {
                for (var i = 0; i < 180; i++) {
                    self.ctrl.log(world.objects.countries.geometries[i]);
                    countryClicked(world.objects.countries.geometries[i], true)
                }
            });
        }
        this.updateStrokeColor();
    }

    sortCountries () {
        d3.selectAll('.country').each(function () {
            let firstChild = this.parentNode.firstChild;
            if (!this.className.baseVal.includes('stroke-selected')) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    }

    updateStrokeColor () {
        var countries = this.ctrl.selectedCountriesHandler.selectedCountries;

        d3.selectAll('.country')
        .classed('stroke-selected', false)
        .attr('style', null);

        var colorIndex = 0;
        for (var i = 0; i < countries.length; i++) {
            d3.select('#' + countries[i].toUpperCase())
            .classed('stroke-selected', true)
            .style('stroke', this.strokeColors[colorIndex]);

            colorIndex++;
            if (colorIndex > this.strokeColors.length) {
                colorIndex = 0;
            }
        }
        this.sortCountries();
    }

    getColor () {
      var color = this.strokeColors[this.currentColorIndex];
      this.currentColorIndex++;

      return color;
    }

    updateData () {
        var self = this;
        d3.select('svg').selectAll('.country')
        .attr('fill', function (d) {
            return self.colorScale(self.getCountryPercentage(d.id));
        });
    }

    getCountryPercentage (countryCode) {
        var minMaxCur = this.ctrl.data[countryCode.toLowerCase()];

        if (typeof minMaxCur !== 'undefined') {
            var percent = 0;
            var min = 0;
            var max = minMaxCur.max;
            var curr = minMaxCur.cur;

            if (this.ctrl.timelapseHandler.isAnimating) {
                curr = minMaxCur.all[this.ctrl.timelapseHandler.getCurrent()];
            }

            if (max - min !== 0) {
                percent = (curr - min) / (max - min) * 100;
            }

            return percent;
        }

        return 0;
    }
}
