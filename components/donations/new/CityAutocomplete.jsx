import geoLocationServices from '@/lib/services/geoLocationServices';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '@/constants/brandColors';
import { hairline, radii, shadow } from '@/constants/theme';

const CityAutocomplete = ({ city, onCityChange, onLocationSelect }) => {
  const [results, setResults] = useState([]);

  const [searching, setSearching] = useState(false);

  const [showResults, setShowResults] = useState(false);

  const selectedRef = useRef(false);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current = false;
      return;
    }

    const query = city?.trim();

    if (!query || query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const response = await geoLocationServices.searchLocation(query);

        if (!response?.success || !Array.isArray(response?.data)) {
          setResults([]);
          return;
        }

        /*
         * Keep suggestions reasonable.
         */
        setResults(response.data.slice(0, 6));

        setShowResults(true);
      } catch (error) {
        console.log('[Geo] Search error:', error);

        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [city]);

  const extractLocation = item => {
    const address = item?.address || {};

    const selectedCity =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.hamlet ||
      address.county ||
      '';

    const district =
      address.state_district || address.county || address.district || '';

    const state = address.state || '';

    const country = address.country || '';

    const pincode = address.postcode || '';

    return {
      city: selectedCity,
      district,
      state,
      country,
      pincode,

      latitude: item?.lat || '',
      longitude: item?.lon || '',

      displayName: item?.display_name || '',
    };
  };

  const handleSelect = item => {
    const location = extractLocation(item);

    selectedRef.current = true;

    onCityChange(location.city || city);

    onLocationSelect(location);

    setShowResults(false);
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        City
        <Text style={styles.required}> *</Text>
      </Text>

      <View style={styles.inputWrapper}>
        <Ionicons name="location-outline" size={16} color={COLORS.warmBrown} />

        <TextInput
          value={city}
          onChangeText={value => {
            onCityChange(value);
            setShowResults(true);
          }}
          placeholder="Start typing your city"
          placeholderTextColor={COLORS.warmBrown}
          style={styles.input}
        />

        {searching && <ActivityIndicator size="small" color={COLORS.saffron} />}
      </View>

      {showResults && results.length > 0 && (
        <View style={styles.results}>
          {results.map((item, index) => {
            const address = item?.address || {};

            const cityName =
              address.city ||
              address.town ||
              address.village ||
              address.municipality ||
              address.county ||
              'Location';

            return (
              <TouchableOpacity
                key={`${item?.place_id}-${index}`}
                style={[
                  styles.resultItem,
                  index !== results.length - 1 && styles.resultBorder,
                ]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.75}>
                <View style={styles.resultIcon}>
                  <Ionicons name="location" size={14} color={COLORS.saffron} />
                </View>

                <View style={styles.resultContent}>
                  <Text style={styles.resultCity} numberOfLines={1}>
                    {cityName}
                  </Text>

                  <Text style={styles.resultAddress} numberOfLines={2}>
                    {item?.display_name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default CityAutocomplete;

const styles = StyleSheet.create({
  container: {
    marginBottom: 11,
    zIndex: 20
  },
  label: {
    marginLeft: 2,
    marginBottom: 5,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.deepBrown
  },
  required: {
    color: COLORS.dangerRed
  },
  inputWrapper: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.creamDark,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: COLORS.deepBrown
  },
  results: {
    marginTop: 5,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: hairline,
    backgroundColor: COLORS.cream,
    overflow: 'hidden',
    ...shadow.raised
  },
  resultItem: {
    minHeight: 55,
    paddingHorizontal: 11,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center'
  },
  resultBorder: {
    borderBottomWidth: 1,
    borderBottomColor: hairline
  },
  resultIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultContent: {
    flex: 1,
    marginLeft: 9
  },
  resultCity: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepBrown
  },
  resultAddress: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.warmBrown
  }
});
