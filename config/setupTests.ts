import { mockInsights } from 'insights-common-typescript-dev';
import React from 'react';

declare const global: any;
global.React = React;
mockInsights();
