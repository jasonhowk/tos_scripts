input previous_days = 5;
input aggregation_period = AggregationPeriod.DAY;
input atr_length = 14;
input average_type = AverageType.WILDERS;
input highlight_range = yes;

DefineGlobalColor("Range Color", Color.PLUM);


#def chartPeriod = GetAggregationPeriod();
#AddLabel(yes, "Chart Period: " + chartPeriod, Color.YELLOW);

def prevClose = close(period = aggregation_period)[1];
#AddLabel(yes, "Prev Close: " + prevClose, Color.YELLOW);

def c_atr = MovingAverage(average_type, TrueRange(high(period=aggregation_period), close(period=aggregation_period), low(period=aggregation_period)), atr_length);
def atr_avg = c_atr/2;

def lastBar = !IsNaN(close(period=aggregation_period)) && IsNaN(close(period=aggregation_period)[-1]);
def lastClose = if lastBar then prevClose else lastClose[1];
  
def atrh = if lastBar then lastClose + atr_avg else atrh[1];
def atrl = if lastBar then lastClose - atr_avg else atrl[1];
AddLabel(yes, "ATR HIGH: " + atrh, Color.PLUM);
AddLabel(yes, "ATR LOW: " + atrl, Color.PLUM);

plot low = if IsNaN(close(period=aggregation_period)[-previous_days-1]) then atrl[-previous_days] else Double.NaN;
low.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
low.setLineWeight(3.0);
low.SetDefaultColor(Color.PLUM);

plot high = if IsNaN(close(period=aggregation_period)[-previous_days-1]) then atrh[-previous_days] else Double.NaN;
high.SetPaintingStrategy(PaintingStrategy.HORIZONTAL);
high.setLineWeight(3.0);
high.SetDefaultColor(Color.PLUM);

AddCloud(if highlight_range then low else Double.NaN, high,GlobalColor("Range Color"),GlobalColor("Range Color"));

