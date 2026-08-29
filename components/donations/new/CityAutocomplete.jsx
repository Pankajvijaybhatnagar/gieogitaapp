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
        <Ionicons name="location-outline" size={16} color="#95755E" />

        <TextInput
          value={city}
          onChangeText={value => {
            onCityChange(value);
            setShowResults(true);
          }}
          placeholder="Start typing your city"
          placeholderTextColor="#AF9987"
          style={styles.input}
        />

        {searching && <ActivityIndicator size="small" color="#704025" />}
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
                  <Ionicons name="location" size={14} color="#704025" />
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
    zIndex: 20,
  },

  label: {
    marginLeft: 2,
    marginBottom: 5,
    fontSize: 10.5,
    fontWeight: '600',
    color: '#634735',
  },

  required: {
    color: '#B54E3F',
  },

  inputWrapper: {
    height: 43,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9DCCE',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 12,
    color: '#412A1D',
  },

  results: {
    marginTop: 5,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E8DACA',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',

    shadowColor: '#5B3420',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  resultItem: {
    minHeight: 55,
    paddingHorizontal: 11,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },

  resultBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1E7DE',
  },

  resultIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#F5E8DC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resultContent: {
    flex: 1,
    marginLeft: 9,
  },

  resultCity: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#513322',
  },

  resultAddress: {
    marginTop: 2,
    fontSize: 9.5,
    lineHeight: 13,
    color: '#987B67',
  },
});
